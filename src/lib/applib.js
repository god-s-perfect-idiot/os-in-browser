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
import Settings from "../apps/Settings/Settings.svelte"
import Pong from "../apps/Pong.svelte"
import TicTacToe from "../apps/TicTacToe.svelte"
import Minesweeper from "../apps/Minesweeper.svelte"
import FlappyBird from "../apps/FlappyBird.svelte"
import FilesSvelte from "../apps/Files.svelte"

export const apps = {
    help: {
        appId: 'help',
        component: Help,
        needsParent: false,
        name: 'Help',
        icon: "mdi:help",
        windowClassOverrides: "dot-matrix",
        props: { },
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
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:feedback",
        windowClassOverrides: "",
        props: { },
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
        color: '#808080',
        icon: "fluent:window-16-regular",
        windowClassOverrides: "",
        props: { },
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
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:file",
        windowClassOverrides: "",
        props: { },
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
        color: '#808080',
        icon: "mdi:folder",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    files: {
        appId: 'files',
        component: FilesSvelte,
        needsParent: false,
        name: 'Files',
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:folder-open",
        windowClassOverrides: "dot-matrix",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    settings: {
        appId: 'settings',
        component: Settings,
        needsParent: false,
        name: 'Settings',
        iconColor: '#ffffff',  
        color: '#808080',
        icon: "mdi:cog",
        windowClassOverrides: "dot-matrix",
        props: { },
        defaultWindowSize: {
            width: "60rem",
            height: "31rem"
        }
    },
    console: {
        appId: 'console',
        component: Console,
        needsParent: false,
        name: 'Console',
        iconColor: '#808080',  
        color: '#000000',
        icon: "mdi:terminal",
        windowClassOverrides: "!bg-black text-white",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "30rem"
        }
    },
    calculator: {
        appId: 'calculator',
        component: Calculator,
        needsParent: false,
        name: 'Calculator',
        iconColor: '#ffffff',  
        color: '#808080',
        icon: "mdi:calculator",
        windowClassOverrides: "dot-matrix",
        props: { },
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
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:brush",
        windowClassOverrides: "dot-matrix",
        props: { },
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
        color: '#808080',
        icon: "mdi:clock",
        windowClassOverrides: "dot-matrix",
        props: { },
        defaultWindowSize: {
            width: "35rem",
            height: "10rem"
        }
    },
    notes: {
        appId: 'notes',
        component: Notes,
        needsParent: false,
        name: 'Notes',
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:pen",
        windowClassOverrides: "",
        props: { },
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
        color: '#808080',
        icon: "mdi:stopwatch",
        windowClassOverrides: "dot-matrix",
        props: { },
        defaultWindowSize: {
            width: "20rem",
            height: "25rem"
        }
    },
    pomodoro: {
        appId: 'pomodoro',
        component: Pomodoro,
        needsParent: false,
        name: 'Pomodoro',
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:hourglass",
        windowClassOverrides: "dot-matrix",
        props: { },
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
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:heart-pulse",
        windowClassOverrides: "",
        props: { },
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
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:check-bold",
        windowClassOverrides: "dot-matrix",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    wiki: {
        appId: 'wiki',
        component: Frame,
        needsParent: false,
        name: 'Wiki',
        iconColor: '#808080',  
        color: '#ffffff',
        icon: "mdi:wikipedia",
        windowClassOverrides: "",
        props: { url: "https://www.wikipedia.org?dis", title: "Wikipedia" },
        defaultWindowSize: {
            width: "50rem",
            height: "30rem"
        }
    },
    snake: {
        appId: 'snake',
        component: Snake,
        needsParent: false,
        name: 'Snake',
        iconColor: '#ffffff',  
        color: '#808080',
        icon: "mdi:snake",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "20rem"
        }
    },
    pong: {
        appId: 'pong',
        component: Pong,
        needsParent: false,
        name: 'Pong',
        iconColor: '#ffffff',  
        color: '#808080',
        icon: "mdi:ping-pong",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "35rem"
        }
    },
    ticTacToe: {
        appId: 'ticTacToe',
        component: TicTacToe,
        needsParent: false,
        name: 'Tic Tac Toe',
        iconColor: '#ffffff',  
        color: '#808080',
        icon: "mdi:gamepad-circle",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "33rem",
            height: "33rem"
        }
    },
    minesweeper: {
        appId: 'minesweeper',
        component: Minesweeper,
        needsParent: false,
        name: 'Minesweeper',
        iconColor: '#ffffff',  
        color: '#808080',
        icon: "mdi:mine",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "40rem"
        }
    },
    flappyBird: {
        appId: 'flappyBird',
        component: FlappyBird,
        needsParent: false,
        name: 'Flappy Bird',
        iconColor: '#ffffff',  
        color: '#808080',
        icon: "mdi:bird",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "40rem"
        }
    }
}