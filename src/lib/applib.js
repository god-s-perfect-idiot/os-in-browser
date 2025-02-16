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
        customIconStyle: '',
        color: '#f1bf00',
        icon: "icons/stock/help.png",
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
        customIconStyle: '',  
        color: '#cf3f00',
        icon: "icons/stock/feedback.png",
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
        customIconStyle: '',  
        color: '#3b82f6',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: '',  
        color: '#cf3f00',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: '',  
        color: '#3b82f6',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: 'h-14',  
        color: '#f1bf00',
        icon: "icons/stock/files.png",
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
        customIconStyle: '',  
        color: '#1f3abf',
        icon: "icons/becoming/settings.png",
        props: { },
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
        customIconStyle: 'h-22',  
        color: '#000000',
        icon: "icons/stock/console.png",
        props: { },
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
        customIconStyle: 'w-24',  
        color: '#f1bf00',
        icon: "icons/stock/calculator.png",
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
        customIconStyle: 'h-16',  
        color: '#cf3f00',
        icon: "icons/stock/sketch.png",
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
        customIconStyle: 'w-20',  
        color: '#3b82f6',
        icon: "icons/stock/clock.png",
        props: { },
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
        customIconStyle: 'h-12',  
        color: '#cf3f00',
        icon: "icons/stock/notes.png",
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
        customIconStyle: '',  
        color: '#3b82f6',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: 'h-20',  
        color: '#cf3f00',
        icon: "icons/stock/pomodoro.png",
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
        customIconStyle: '',  
        color: '#3b82f6',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: '',  
        color: '#cf3f00',
        icon: "icons/becoming/settings.png",
        props: { },
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
        customIconStyle: 'w-20',  
        color: '#3b82f6',
        icon: "icons/stock/snake.png",
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
        customIconStyle: '',  
        color: '#000',
        icon: "icons/becoming/settings.png",
        props: { url: "https://www.wikipedia.org/wiki/" },
        defaultWindowSize: {
            width: "50rem",
            height: "30rem"
        }
    },
    pong: {
        appId: 'pong',
        component: Pong,
        needsParent: false,
        name: 'Pong',
        customIconStyle: '',  
        color: '#cf3f00',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: '',  
        color: '#3b82f6',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: '',  
        color: '#cf3f00',
        icon: "icons/becoming/settings.png",
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
        customIconStyle: '',  
        color: '#3b82f6',
        icon: "icons/becoming/settings.png",
        props: { },
        defaultWindowSize: {
            width: "40rem",
            height: "40rem"
        }
    }
}