function init_waydroid() {
    document.getElementById('initialize-btn').outerHTML =
        '<button type="button" id="initialize-btn" onclick="init_waydroid()" class="btn btn-primary" disabled>Initializing...</button>'
    let init_worker = new Worker(
        `data:text/javascript,
        require('child_process').spawnSync('pkexec', ['waydroid', 'init'])
        require('child_process').spawnSync('pkexec', ['systemctl', 'enable', '--now', 'waydroid-container'])
        require('child_process').spawn('sh', ['-c', 'waydroid session start & disown'])
        setTimeout(() => {
            require('child_process').spawnSync('pkexec', ['waydroid', 'shell', 'pm', 'disable', 'com.android.inputmethod.latin'])
            require('child_process').spawnSync('waydroid', ['prop', 'set', 'persist.waydroid.multi_windows', 'true'])
            if (require('child_process').spawnSync('sh', ['-c', 'LC_ALL=C glxinfo | grep "^OpenGL renderer string: "']).stdout.includes('NVIDIA')) {
                require('child_process').spawnSync('sh', ['-c', 'echo "ro.hardware.gralloc=default" | pkexec tee -a /var/lib/waydroid/waydroid.cfg'])
                require('child_process').spawnSync('sh', ['-c', 'echo "ro.hardware.egl=swiftshader" | pkexec tee -a /var/lib/waydroid/waydroid.cfg'])
            }
            require('child_process').spawn('sh', ['-c', 'pkexec waydroid upgrade -o; waydroid session stop; waydroid session start'])
            setTimeout(() => { postMessage('success') }, 1000)
        }, 2000)
        `
    )
    init_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('waydroid-initialize-settings').classList.add('d-none')
            document.getElementById('waydroid-initialized-settings').classList.remove('d-none')
            document.getElementById('first-time-waydroid').classList.remove('d-none')
        }
    }
}

function install_aurora_store() {
    document.getElementById('aurora-store-btn').outerHTML =
        `<button type="button" id="aurora-store-btn" onclick="install_aurora_store()"
            class="btn btn-success" disabled>Installing...</button>`
    let aurora_store_worker = new Worker(
        `data:text/javascript,
            require('child_process').spawnSync('sh', ['-c', 'mkdir -p ~/.cache/blend-settings; rm -f ~/.cache/blend-settings/aurora.apk'])
            let s1 = require('child_process').spawnSync('sh', ['-c', 'wget -O ~/.cache/blend-settings/aurora.apk https://gitlab.com/AuroraOSS/AuroraStore/uploads/bbc1bd5a77ab2b40bbf288ccbef8d1f0/AuroraStore_4.1.1.apk']).status
            if (s1 != 0) {
                postMessage('failed')
            } else {
                require('child_process').spawn('waydroid', ['session', 'start'])
                setTimeout(() => {
                    require('child_process').spawnSync('sh', ['-c', 'waydroid app install ~/.cache/blend-settings/aurora.apk'])
                    setTimeout(() => postMessage('success'), 200)
                }, 2000)
            }
            `
    )
    aurora_store_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('aurora-store-btn').outerHTML =
                `<button type="button btn-success" id="aurora-store-btn" onclick="require('child_process').spawn('waydroid', ['app', 'launch', 'com.aurora.store'])"
                class="btn btn-success">Open</button>`
        } else if (e.data == 'failed') {
            document.getElementById('aurora-store-btn').outerHTML =
                `<button type="button btn-success" id="aurora-store-btn" onclick="install_aurora_store()"
                    class="btn btn-success" disabled>Failed</button>`
            setTimeout(() => {
                document.getElementById('aurora-store-btn').outerHTML =
                    `<button type="button btn-success" id="aurora-store-btn" onclick="install_aurora_store()"
                    class="btn btn-success">Install</button>`
            }, 2000)
        }
    }
}

function install_f_droid() {
    document.getElementById('f-droid-btn').outerHTML =
        `<button type="button" id="f-droid-btn" onclick="install_f_droid()"
            class="btn btn-primary" disabled>Installing...</button>`
    let f_droid_worker = new Worker(
        `data:text/javascript,
            require('child_process').spawnSync('sh', ['-c', 'mkdir -p ~/.cache/blend-settings; rm -f ~/.cache/blend-settings/f-droid.apk'])
            let s1 = require('child_process').spawnSync('sh', ['-c', 'wget -O ~/.cache/blend-settings/f-droid.apk https://f-droid.org/F-Droid.apk']).status
            if (s1 != 0) {
                postMessage('failed')
            } else {
                require('child_process').spawn('waydroid', ['session', 'start'])
                setTimeout(() => {
                    require('child_process').spawnSync('sh', ['-c', 'waydroid app install ~/.cache/blend-settings/f-droid.apk'])
                    setTimeout(() => postMessage('success'), 200)
                }, 2000)
            }
            `
    )
    f_droid_worker.onmessage = e => {
        if (e.data == 'success') {
            document.getElementById('f-droid-btn').outerHTML =
                `<button type="button btn-success" id="fdroid-btn" onclick="require('child_process').spawn('waydroid', ['app', 'launch', 'org.fdroid.fdroid'])"
                    class="btn btn-primary">Open</button>`
        } else if (e.data == 'failed') {
            document.getElementById('f-droid-btn').outerHTML =
                `<button type="button btn-success" id="f-droid-btn" onclick="install_f_droid()"
                    class="btn btn-primary" disabled>Failed</button>`
            setTimeout(() => {
                document.getElementById('f-droid-btn').outerHTML =
                    `<button type="button btn-success" id="f-droid-btn" onclick="install_f_droid()"
                    class="btn btn-primary">Install</button>`
            }, 2000)
        }
    }
}

function waydroid_open_settings() {
    require('child_process').spawn('waydroid', ['app', 'launch', 'com.android.settings'])
}

require('fs').stat('/var/lib/waydroid', (err, stat) => {
    if (err == null) {
        document.getElementById('waydroid-initialize-settings').classList.add('d-none')
        document.getElementById('waydroid-initialized-settings').classList.remove('d-none')
        if (require('child_process').spawnSync('sh', ['-c', 'LC_ALL=C glxinfo | grep "^OpenGL renderer string: "']).stdout.includes('NVIDIA')) {
            document.getElementById('nvidia-warning-installed').classList.remove('d-none')
        }
        require('child_process').spawn('waydroid', ['session', 'start'])
        setTimeout(() => {
            if (require('child_process').spawnSync('waydroid', ['app', 'list']).stdout.includes('com.aurora.store')) {
                document.getElementById('aurora-store-btn').outerHTML =
                    `<button type="button btn-success" id="aurora-store-btn" onclick="require('child_process').spawn('waydroid', ['app', 'launch', 'com.aurora.store'])"
                        class="btn btn-success">Open</button>`
            } else {
                document.getElementById('aurora-store-btn').outerHTML =
                    `<button type="button btn-success" id="aurora-store-btn" onclick="install_aurora_store()"
                        class="btn btn-success">Install</button>`
            }
            if (require('child_process').spawnSync('waydroid', ['app', 'list']).stdout.includes('org.fdroid.fdroid')) {
                document.getElementById('f-droid-btn').outerHTML =
                    `<button type="button btn-success" id="fdroid-btn" onclick="require('child_process').spawn('waydroid', ['app', 'launch', 'org.fdroid.fdroid'])"
                        class="btn btn-primary">Open</button>`
            } else {
                document.getElementById('f-droid-btn').outerHTML =
                    `<button type="button btn-success" id="f-droid-btn" onclick="install_f_droid()"
                        class="btn btn-primary">Install</button>`
            }
        }, 1000)
    } else {
        if (require('child_process').spawnSync('sh', ['-c', 'LC_ALL=C glxinfo | grep "^OpenGL renderer string: "']).stdout.includes('NVIDIA')) {
            document.getElementById('nvidia-warning').classList.remove('d-none')
        }
    }
})

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