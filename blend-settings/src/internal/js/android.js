function rollback() {
    let rollback_worker = new Worker(
        `data:text/javascript,
        let s = require('child_process').spawnSync('pkexec', ['blend-system', 'rollback']).status
        if (s === 0) {
            postMessage('success')
        } else {
            postMessage('failure')
        }
        `
    )
    rollback_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('rollback-btn').outerHTML =
                '<button type="button" class="btn btn-danger" onclick="undo_rollback()" id="rollback-btn">Cancel rollback</button>'
        } else {
            document.getElementById('rollback-btn').outerHTML =
                '<button type="button" class="btn btn-danger" id="rollback-btn" disabled>Failed</button>'
            setTimeout(() => document.getElementById('rollback-btn').outerHTML =
                '<button type="button" class="btn btn-danger" onclick="rollback()" id="rollback-btn">Rollback</button>', 2000)
        }
    }
}

function undo_rollback() {
    let undo_rollback_worker = new Worker(
        `data:text/javascript,
        let s = require('child_process').spawnSync('pkexec', ['rm', '-f', '/blend/states/.load_prev_state']).status
        if (s === 0) {
            postMessage('success')
        } else {
            postMessage('failure')
        }
        `
    )
    undo_rollback_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('rollback-btn').outerHTML =
                '<button type="button" class="btn btn-danger" onclick="rollback()" id="rollback-btn">Rollback</button>'
        } else {
            document.getElementById('rollback-btn').outerHTML =
                '<button type="button" class="btn btn-danger" id="rollback-btn" disabled>Failed</button>'
            setTimeout(() => document.getElementById('rollback-btn').outerHTML =
                '<button type="button" class="btn btn-danger" onclick="undo_rollback()" id="rollback-btn">Cancel rollback</button>', 2000)
        }
    }
}

function init_waydroid() {
    document.getElementById('initialize-btn').outerHTML =
        '<button type="button" id="initialize-btn" onclick="init_waydroid()" class="btn btn-primary" disabled>Initializing...</button>'
    let init_worker = new Worker(
        `data:text/javascript,
        require('child_process').spawnSync('pkexec', ['waydroid', 'init'])
        require('child_process').spawn('sh', ['-c', 'waydroid session start & disown'])
        setTimeout(() => {
            require('child_process').spawnSync('pkexec', ['waydroid', 'shell', 'pm', 'disable', 'com.android.inputmethod.latin'])
            require('child_process').spawnSync('waydroid', ['prop', 'set', 'persist.waydroid.multi_windows', 'true'])
            postMessage('success')
        }, 2000)
        `
    )
    init_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('init-waydroid').classList.add('d-none')
            document.getElementById('waydroid-initialized-settings').classList.remove('d-none')
        }
    }
}

function enable_multi_window() {
    document.getElementById('multiwindow-btn').outerHTML =
        '<button type="button" id="multiwindow-btn" onclick="enable_multi_window()" class="btn btn-primary" disabled>Enabling...</button>'
    let multi_window_worker = new Worker(
        `data:text/javascript,
            require('child_process').spawn('sh', ['-c', 'waydroid session start & disown'])
            setTimeout(() => { require('child_process').spawnSync('waydroid', ['prop', 'set', 'persist.waydroid.multi_windows', 'true']); require('child_process').spawn('sh', ['-c', 'waydroid session stop']); postMessage('success') }, 500)
            `
    )
    multi_window_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('multiwindow-btn').outerHTML =
                '<button type="button" id="multiwindow-btn" onclick="disable_multi_window()" class="btn btn-primary">Disable</button>'
        }
    }
}

function disable_multi_window() {
    document.getElementById('multiwindow-btn').outerHTML =
        '<button type="button" id="multiwindow-btn" onclick="enable_multi_window()" class="btn btn-primary" disabled>Disabling...</button>'
    let multi_window_worker = new Worker(
        `data:text/javascript,
            require('child_process').spawn('sh', ['-c', 'waydroid session start & disown'])
            setTimeout(() => { require('child_process').spawnSync('waydroid', ['prop', 'set', 'persist.waydroid.multi_windows', 'false']); require('child_process').spawn('sh', ['-c', 'waydroid session stop']); postMessage('success') }, 500)
            `
    )
    multi_window_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('multiwindow-btn').outerHTML =
                '<button type="button" id="multiwindow-btn" onclick="enable_multi_window()" class="btn btn-primary">Enable</button>'
        }
    }
}

function check_multi_window_enabled() {
    let check_worker = new Worker(
        `data:text/javascript,
            require('child_process').spawn('sh', ['-c', 'waydroid session start & disown'])
            setTimeout(() => { let val = require('child_process').spawnSync('waydroid', ['prop', 'get', 'persist.waydroid.multi_windows']).stdout; postMessage(val) }, 500)
            `
    )
    check_worker.onmessage = e => {
        if (new TextDecoder("utf-8").decode(e.data).trim() == 'true') {
            document.getElementById('multiwindow-btn').outerHTML =
                '<button type="button" id="multiwindow-btn" onclick="disable_multi_window()" class="btn btn-primary">Disable</button>'
        } else {
            document.getElementById('multiwindow-btn').outerHTML =
                '<button type="button" id="multiwindow-btn" onclick="enable_multi_window()" class="btn btn-primary">Enable</button>'
        }
    }
}

require('fs').stat('/var/lib/waydroid', (err, stat) => {
    if (err == null) {
        document.getElementById('waydroid-initialize-settings').classList.add('d-none')
        document.getElementById('waydroid-initialized-settings').classList.remove('d-none')
    }
})

check_state_creation()
check_rollback()

$('#automatic-state-toggle').on('change', () => {
    if (!document.getElementById('automatic-state-toggle').checked) {
        let enable_autostate_worker = new Worker(
            `data:text/javascript,
            let s = require('child_process').spawnSync('pkexec', ['rm', '-f', '/blend/states/.disable_states']).status
            if (s === 0) {
                postMessage('success')
            } else {
                postMessage('failure')
            }
            `
        )
        enable_autostate_worker.onmessage = e => {
            if (e.data == 'success') {
                document.getElementById('automatic-state-toggle').checked = false
            } else {
                document.getElementById('automatic-state-toggle').checked = true
            }
        }
    } else {
        let disable_autostate_worker = new Worker(
            `data:text/javascript,
            let s = require('child_process').spawnSync('pkexec', ['blend-system', 'toggle-states']).status
            if (s === 0) {
                postMessage('success')
            } else {
                postMessage('failure')
            }
            `
        )
        disable_autostate_worker.onmessage = e => {
            if (e.data == 'success') {
                document.getElementById('automatic-state-toggle').checked = true
            } else {
                document.getElementById('automatic-state-toggle').checked = false
            }
        }
    }
});