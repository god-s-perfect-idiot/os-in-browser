
import { writable, derived, get } from 'svelte/store';

// File system node types
const NodeType = {
  FILE: 'file',
  DIRECTORY: 'directory'
};

// Initial file system structure
const initialFS = {
  type: NodeType.DIRECTORY,
  name: 'root',
  children: {},
  path: '/',
  created: Date.now(),
  modified: Date.now()
};

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Safe localStorage operations
const storage = {
  get: (key) => {
    try {
      if (!isBrowser) return null;
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      if (!isBrowser) return;
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Failed to write to localStorage:', e);
    }
  }
};

// Create the main file system store
function createFileSystem() {
  // Initialize from localStorage or use default
  const storedFS = storage.get('fileSystem');
  const initial = storedFS ? JSON.parse(storedFS) : initialFS;
  
  const { subscribe, set, update } = writable(initial);
  
  // Current working directory path
  const currentPath = writable('/');
  
  // Helper to get node at path
  const getNodeAtPath = (fs, path) => {
    if (path === '/') return fs;
    const parts = path.split('/').filter(Boolean);
    let current = fs;
    
    for (const part of parts) {
      if (!current.children || !current.children[part]) return null;
      current = current.children[part];
    }
    return current;
  };

  // Helper to update localStorage
  const persistFS = (fs) => {
    storage.set('fileSystem', JSON.stringify(fs));
  };

  // Store API
  const api = {
    subscribe,
    
    // Navigate to a path
    cd: (path) => {
      if (path.startsWith('/')) {
        currentPath.set(path);
      } else {
        currentPath.update(curr => {
          const newPath = `${curr}/${path}`.replace(/\/+/g, '/');
          return newPath;
        });
      }
    },
    
    // Get current directory contents
    ls: () => {
      return derived([{ subscribe }, currentPath], ([$fs, $currentPath]) => {
        const node = getNodeAtPath($fs, $currentPath);
        if (!node || node.type !== NodeType.DIRECTORY) return null;
        return Object.entries(node.children).map(([name, node]) => ({
          name,
          type: node.type,
          created: node.created,
          modified: node.modified
        }));
      });
    },
    
    // Create a new directory
    mkdir: (name) => {
      update(fs => {
        const curr = getNodeAtPath(fs, get(currentPath));
        if (!curr || curr.type !== NodeType.DIRECTORY) return fs;
        
        curr.children[name] = {
          type: NodeType.DIRECTORY,
          name,
          children: {},
          path: `${get(currentPath)}/${name}`.replace(/\/+/g, '/'),
          created: Date.now(),
          modified: Date.now()
        };
        
        persistFS(fs);
        return fs;
      });
    },
    
    // Create a new file
    touch: (name, content = '', mimeType = 'text/plain') => {
      update(fs => {
        const curr = getNodeAtPath(fs, get(currentPath));
        if (!curr || curr.type !== NodeType.DIRECTORY) return fs;
        
        curr.children[name] = {
          type: NodeType.FILE,
          name,
          content,
          mimeType,
          path: `${get(currentPath)}/${name}`.replace(/\/+/g, '/'),
          created: Date.now(),
          modified: Date.now()
        };
        
        persistFS(fs);
        return fs;
      });
    },
    
    // Write content to a file
    writeFile: (path, content) => {
      update(fs => {
        const node = getNodeAtPath(fs, path);
        if (!node || node.type !== NodeType.FILE) return fs;
        
        node.content = content;
        node.modified = Date.now();
        
        persistFS(fs);
        return fs;
      });
    },
    
    // Read file content
    readFile: (path) => {
      return derived({ subscribe }, $fs => {
        const node = getNodeAtPath($fs, path);
        if (!node || node.type !== NodeType.FILE) return null;
        return node.content;
      });
    },
    
    // Delete a file or directory
    rm: (path) => {
      update(fs => {
        const parts = path.split('/').filter(Boolean);
        const name = parts.pop();
        const parentPath = '/' + parts.join('/');
        
        const parent = getNodeAtPath(fs, parentPath);
        if (!parent || !parent.children[name]) return fs;
        
        delete parent.children[name];
        persistFS(fs);
        return fs;
      });
    },
    
    // Move/rename a file or directory
    mv: (oldPath, newPath) => {
      update(fs => {
        const node = getNodeAtPath(fs, oldPath);
        if (!node) return fs;
        
        // Remove from old location
        api.rm(oldPath);
        
        // Add to new location
        const parts = newPath.split('/').filter(Boolean);
        const name = parts.pop();
        const parentPath = '/' + parts.join('/');
        
        const parent = getNodeAtPath(fs, parentPath);
        if (!parent || parent.type !== NodeType.DIRECTORY) return fs;
        
        node.name = name;
        node.path = newPath;
        parent.children[name] = node;
        
        persistFS(fs);
        return fs;
      });
    }
  };

  return api;
}

// Export a singleton instance
export const fileSystem = createFileSystem();