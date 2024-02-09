function update_system() {
    let start_update_worker = new Worker(
        `data:text/javascript,
        let s = require('child_process').spawnSync('pkexec', ['systemctl', 'start', 'akshara-system-update']).status
        if (s === 0) {
            postMessage('success')
        } else {
            postMessage('failure')
        }
        `
    )
    start_update_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('update-btn').textContent = 'Updating...'
            document.getElementById('update-btn').disabled = true
        }
    }
}

function check_system_update() {
    if (require('fs').existsSync('/.update')) {
        document.getElementById('update-btn').onclick = () => {
            require('child_process').spawnSync('reboot')
        }

        document.getElementById('update-btn').textContent = 'Reboot'
        document.getElementById('update-btn').disabled = false

        return;
    }
    let start_update_worker = new Worker(
        `data:text/javascript,
        let s = require('child_process').spawnSync('systemctl', ['is-active', '--quiet', 'akshara-system-update']).status
        if (s === 0) {
            postMessage('success')
        } else {
            postMessage('failure')
        }
        `
    )
    start_update_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('update-btn').textContent = 'Updating...'
            document.getElementById('update-btn').disabled = true
        } else {
            document.getElementById('update-btn').textContent = 'Update'
            document.getElementById('update-btn').disabled = false
        }
    }
}

check_system_update()
setInterval(check_system_update, 5000)

// function check_app_grouping() {
//     if (require('fs').existsSync(`${require('os').homedir()}/.config/categorize_apps_gnome_disable`)) {
//         document.getElementById('app-grouping-toggle').setAttribute('checked', '')
//     }
// }

// check_app_grouping()

// $('#app-grouping-toggle').on('change', () => {
//     if (!document.getElementById('app-grouping-toggle').checked) {
//         let enable_autogrouping_worker = new Worker(
//             `data:text/javascript,
//             let s = require('child_process').spawnSync('rm', ['-f', '${require('os').homedir()}/.config/categorize_apps_gnome_disable']).status
//             if (s === 0) {
//                 postMessage('success')
//             } else {
//                 postMessage('failure')
//             }
//             `
//         )
//         enable_autogrouping_worker.onmessage = e => {
//             if (e.data == 'success') {
//                 document.getElementById('app-grouping-toggle').checked = false
//             } else {
//                 document.getElementById('app-grouping-toggle').checked = true
//             }
//         }
//     } else {
//         let disable_autogrouping_worker = new Worker(
//             `data:text/javascript,
//             require('child_process').spawnSync('mkdir', ['-p', '${require('os').homedir()}/.config']).status
//             let s = require('child_process').spawnSync('touch', ['${require('os').homedir()}/.config/categorize_apps_gnome_disable']).status
//             if (s === 0) {
//                 postMessage('success')
//             } else {
//                 postMessage('failure')
//             }
//             `
//         )
//         disable_autogrouping_worker.onmessage = e => {
//             if (e.data == 'success') {
//                 document.getElementById('app-grouping-toggle').checked = true
//             } else {
//                 document.getElementById('app-grouping-toggle').checked = false
//             }
//         }
//     }
// });

// if (require('process').env.XDG_CURRENT_DESKTOP.includes('GNOME')) {
//     $('#app-grouping-item').removeClass('d-none')
// }