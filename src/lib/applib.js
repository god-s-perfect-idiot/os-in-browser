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

export const apps = {
    help: {
        appId: 'help',
        component: Help,
        needsParent: false,
        name: 'Help',
        iconColor: '#cf3f00',
        color: '#ffffff',
        icon: "mdi:help",
        windowClassOverrides: "!bg-[#f1f1f1]",
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
        iconColor: '#02a20f',  
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
        color: '#3b82f6',
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
        iconColor: '#3b82f6',  
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
        color: '#3b82f6',
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
        component: null,
        needsParent: false,
        name: 'Files',
        iconColor: '#f1cf2c',  
        color: '#ffffff',
        icon: "mdi:folder-open",
        windowClassOverrides: "",
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
        color: '#1f3abf',
        icon: "mdi:cog",
        // This is uglyyyyy
        windowClassOverrides: "!bg-[#D8E0D0]",
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
        iconColor: '#00ff00',  
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
        color: '#f1bf00',
        icon: "mdi:calculator",
        windowClassOverrides: "!bg-[#f9faef]",
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
        iconColor: '#cf3f00',  
        color: '#ffffff',
        icon: "mdi:brush",
        windowClassOverrides: "",
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
        color: '#3b82f6',
        icon: "mdi:clock",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "27rem",
            height: "12rem"
        }
    },
    notes: {
        appId: 'notes',
        component: Notes,
        needsParent: false,
        name: 'Notes',
        iconColor: '#cf3f00',  
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
        color: '#3b82f6',
        icon: "mdi:stopwatch",
        windowClassOverrides: "",
        props: { },
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
        iconColor: '#cf3f00',  
        color: '#ffffff',
        icon: "mdi:hourglass",
        windowClassOverrides: "",
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
        iconColor: '#02a20f',  
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
        iconColor: '#cf3f00',  
        color: '#ffffff',
        icon: "mdi:check",
        windowClassOverrides: "",
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
        iconColor: '#000',  
        color: '#ffffff',
        icon: "mdi:wikipedia",
        windowClassOverrides: "",
        props: { url: "https://www.wikipedia.org/wiki/" },
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
        color: '#cf3f00',
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
        color: '#cf3f00',
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
        color: '#cf3f00',
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
        color: '#cf3f00',
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
        color: '#cf3f00',
        icon: "mdi:bird",
        windowClassOverrides: "",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "40rem"
        }
    }
}