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

function save_state() {
    $("#settings-tabs").find("*").prop('disabled', true)

    let save_state_worker = new Worker(
        `data:text/javascript,
        let s = require('child_process').spawnSync('pkexec', ['blend-system', 'save-state']).status
        if (s === 0) {
            postMessage('success')
        } else {
            postMessage('failure')
        }
        `
    )
    save_state_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('save-state-btn').outerHTML =
                '<button type="button" class="btn btn-success" id="save-state-btn" disabled>Saved state</button>'
            $("#settings-tabs").find("*").prop('disabled', false)
            setTimeout(() => document.getElementById('save-state-btn').outerHTML =
                '<button type="button" id="save-state-btn" onclick="save_state()" class="btn btn-success">Save state</button>', 2000)
        } else {
            document.getElementById('save-state-btn').outerHTML =
                '<button type="button" class="btn btn-success" id="save-state-btn" disabled>Failed</button>'
            $("#settings-tabs").find("*").prop('disabled', false)
            setTimeout(() => document.getElementById('save-state-btn').outerHTML =
                '<button type="button" id="save-state-btn" onclick="save_state()" class="btn btn-success">Save state</button>', 2000)
        }
    }
}

function check_rollback() {
    if (require('fs').existsSync('/blend/states/.load_prev_state')) {
        document.getElementById('rollback-btn').outerHTML =
            '<button type="button" class="btn btn-danger" onclick="undo_rollback()" id="rollback-btn">Cancel rollback</button>'
    } else {
        document.getElementById('rollback-btn').outerHTML =
            '<button type="button" class="btn btn-danger" onclick="rollback()" id="rollback-btn">Rollback</button>'
    }
}

function check_state_creation() {
    if (require('fs').existsSync('/blend/states/.disable_states')) {
        document.getElementById('automatic-state-toggle').setAttribute('checked', '')
    }
}

function check_app_grouping() {
    if (require('fs').existsSync(`${require('os').homedir()}/.config/categorize_apps_gnome_disable`)) {
        document.getElementById('app-grouping-toggle').setAttribute('checked', '')
    }
}

check_app_grouping()
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

$('#app-grouping-toggle').on('change', () => {
    if (!document.getElementById('app-grouping-toggle').checked) {
        let enable_autogrouping_worker = new Worker(
            `data:text/javascript,
            let s = require('child_process').spawnSync('rm', ['-f', '${require('os').homedir()}/.config/categorize_apps_gnome_disable']).status
            if (s === 0) {
                postMessage('success')
            } else {
                postMessage('failure')
            }
            `
        )
        enable_autogrouping_worker.onmessage = e => {
            if (e.data == 'success') {
                document.getElementById('app-grouping-toggle').checked = false
            } else {
                document.getElementById('app-grouping-toggle').checked = true
            }
        }
    } else {
        let disable_autogrouping_worker = new Worker(
            `data:text/javascript,
            require('child_process').spawnSync('mkdir', ['-p', '${require('os').homedir()}/.config']).status
            let s = require('child_process').spawnSync('touch', ['${require('os').homedir()}/.config/categorize_apps_gnome_disable']).status
            if (s === 0) {
                postMessage('success')
            } else {
                postMessage('failure')
            }
            `
        )
        disable_autogrouping_worker.onmessage = e => {
            if (e.data == 'success') {
                document.getElementById('app-grouping-toggle').checked = true
            } else {
                document.getElementById('app-grouping-toggle').checked = false
            }
        }
    }
});

if (require('process').env.XDG_CURRENT_DESKTOP.includes('GNOME')) {
    $('#app-grouping-item').removeClass('d-none')
}