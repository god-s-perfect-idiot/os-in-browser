import Frame from "../apps/Frame.svelte"
import Feedback from "../apps/Feedback.svelte"
import Help from "../apps/Help.svelte"
import Console from "../apps/Console.svelte"
import Calculator from "../apps/Calculator.svelte"
import Sketch from "../apps/Sketch.svelte"
import Clock from "../apps/Clock.svelte"
import Notes from "../apps/Notes.svelte"
import Stopwatch from "../apps/Stopwatch.svelte"
import Pomodoro from "../apps/Pomodoro.svelte"
import Processes from "../apps/Processes.svelte"
import Todo from "../apps/Todo.svelte"
import Snake from "../apps/Snake.svelte"

export const apps = {
    help: {
        appId: 'help',
        component: Help,
        needsParent: false,
        name: 'Help',
        iconColor: '#ffffff',
        color: '#f1bf00',
        icon: "material-symbols:help",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    feedback: {
        appId: 'feedback',
        component: Feedback,
        needsParent: false,
        name: 'Feedback',
        iconColor: '#ffffff',  
        color: '#cf3f00',
        icon: "material-symbols:feedback",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    frame: {
        appId: 'frame',
        component: Frame,
        needsParent: true,
        name: 'Frame',
        iconColor: '#ffffff',  
        color: '#3b82f6',
        icon: "fluent:window-16-regular",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    file: {
        appId: 'file',
        component: null,
        needsParent: false,
        name: 'File',
        iconColor: '#ffffff',  
        color: '#cf3f00',
        icon: "mingcute:file-fill",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    folder: {
        appId: 'folder',
        component: null,
        needsParent: false,
        name: 'Folder',
        iconColor: '#ffffff',  
        color: '#3b82f6',
        icon: "f7:folder-fill",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    files: {
        appId: 'files',
        component: null,
        needsParent: false,
        name: 'Files',
        iconColor: '#ffffff',  
        color: '#f1bf00',
        icon: "material-symbols:files",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    settings: {
        appId: 'settings',
        component: null,
        needsParent: false,
        name: 'Settings',
        iconColor: '#ffffff',  
        color: '#1f3abf',
        icon: "iconoir:ios-settings",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    console: {
        appId: 'console',
        component: Console,
        needsParent: false,
        name: 'Console',
        iconColor: '#00ff00',  
        color: '#000000',
        icon: "material-symbols:terminal",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    calculator: {
        appId: 'calculator',
        component: Calculator,
        needsParent: false,
        name: 'Calculator',
        iconColor: '#ffffff',  
        color: '#f1bf00',
        icon: "material-symbols:calculate",
        defaultWindowSize: {
            width: "20rem",
            height: "25rem"
        }
    },
    sketch: {
        appId: 'sketch',
        component: Sketch,
        needsParent: false,
        name: 'Sketch',
        iconColor: '#ffffff',  
        color: '#cf3f00',
        icon: "mingcute:brush-fill",
        defaultWindowSize: {
            width: "40rem",
            height: "30rem"
        }
    },
    clock: {
        appId: 'clock',
        component: Clock,
        needsParent: false,
        name: 'Clock',
        iconColor: '#ffffff',  
        color: '#3b82f6',
        icon: "mingcute:time-fill",
        defaultWindowSize: {
            width: "25rem",
            height: "12rem"
        }
    },
    notes: {
        appId: 'notes',
        component: Notes,
        needsParent: false,
        name: 'Notes',
        iconColor: '#ffffff',  
        color: '#cf3f00',
        icon: "mingcute:pencil-fill",
        defaultWindowSize: {
            width: "40rem",
            height: "30rem"
        }
    },
    stopwatch: {
        appId: 'stopwatch',
        component: Stopwatch,
        needsParent: false,
        name: 'Stopwatch',
        iconColor: '#ffffff',  
        color: '#3b82f6',
        icon: "mingcute:stopwatch-fill",
        defaultWindowSize: {
            width: "20rem",
            height: "20rem"
        }
    },
    pomodoro: {
        appId: 'pomodoro',
        component: Pomodoro,
        needsParent: false,
        name: 'Pomodoro',
        iconColor: '#ffffff',  
        color: '#cf3f00',
        icon: "material-symbols:hourglass-full",
        defaultWindowSize: {
            width: "20rem",
            height: "15rem"
        }
    },
    processes: {
        appId: 'processes',
        component: Processes,
        needsParent: false,
        name: 'Processes',
        iconColor: '#ffffff',  
        color: '#3b82f6',
        icon: "mingcute:process-fill",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    todo: {
        appId: 'todo',
        component: Todo,
        needsParent: false,
        name: 'Todo',
        iconColor: '#ffffff',  
        color: '#cf3f00',
        icon: "mingcute:check-fill",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    snake: {
        appId: 'snake',
        component: Snake,
        needsParent: false,
        name: 'Snake',
        iconColor: '#ffffff',  
        color: '#3b82f6',
        icon: "material-symbols:gamepad",
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    }
}