var term

function open_container(name) {
    ipc.send("create-term", { 'title': `Container: ${name}`, 'cmd': `BLEND_NO_CHECK=true blend enter -cn ${name}` });
}

function create_container() {
    $('#inputContainerName').on('input', () => {
        $('#inputContainerName').get(0).setCustomValidity('')
        $('#inputContainerName').get(0).reportValidity();
    })

    container_name = $('#inputContainerName').val()
    if (!(/^[\w\-]+$/.test(container_name))) {
        $('#inputContainerName').get(0).setCustomValidity('Container name may only contain alphanumeric characters and dashes (no spaces allowed).')
        $('#inputContainerName').get(0).reportValidity();
        return
    }
    container_distro = $('#inputContainerDistro').val().toLowerCase().replace(' ', '-')
    ipc.send("create-term", {
        'title': `Creating container: ${container_name}`,
        'cmd': `blend create-container -cn ${container_name} -d ${container_distro} \
                                      && echo -e '\nExiting automatically in 5 seconds.' \
                                      || echo -e '\nContainer creation failed. Exiting automatically in 5 seconds.';
                                      sleep 5` })
    $('#inputContainerName').val('')
    ipc.on('container-created', () => {
        worker.postMessage('update-list')
    })
}

async function remove_container(name) {
    let rm_worker = new Worker(
        `data:text/javascript,
        require('child_process').spawnSync('podman', ['stop', '-t', '0', '${name}'], { encoding: 'utf8' })
        require('child_process').spawnSync('blend', ['remove-container', '${name}'], { encoding: 'utf8' })
        postMessage('')
        `
    )
    rm_worker.onmessage = e => worker.postMessage('update-list')
}

window.worker = new Worker(
    `data:text/javascript,
    function list_containers() {
        return require('child_process').spawnSync('podman', ['ps', '-a', '--no-trunc', '--size', '--format', '{{.Names}}'], { encoding: 'utf8' }).stdout.split(/\\r?\\n/).filter(Boolean).reverse();
    }

    function truncateText(text, maxLength=30) {
        let truncated = text
    
        if (truncated.length > maxLength) {
            truncated = truncated.substr(0, maxLength) + '...';
        }
    
        return truncated;
    }

    function update_container_list() {
        container_list = list_containers()

        container_list_html_default = \`
        <div class="list-group-item">
            <div class="row align-items-center">
                <div class="col">
                    <strong class="mb-0">No containers present.</strong>
                    <p class="text-muted mb-0">Create one from above.</p>
                </div>
            </div>
        </div>
        \`

        container_list_html = ''

        container_list.forEach(container => {
            container_list_html += \`
            <div class="list-group-item" style="padding: 11px 20px 11px 20px; border: 0.5px solid rgba(255, 255, 255, 0.05);">
                <div class="row align-items-center">
                    <div class="col">
                        <strong class="mb-0 container_name">\${container}</strong>
                    </div>
                    <div class="col-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16" onclick="open_container('\${container}')" style="cursor: pointer; margin-right: 8px;">
                        <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" onclick="remove_container('\${container}')" style="cursor: pointer; z-index: 10;">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    </div>
                </div>
            </div>
            \`
        });

        if (container_list.length == 0) {
            postMessage(container_list_html_default)
        } else {
            postMessage(container_list_html)
        }
    }

    self.onmessage = msg => {
        switch(msg) {
            case 'update-list':
                update_container_list()
                break;
        }
        update_container_list()
    }
    `
);

worker.postMessage('update-list')

worker.onmessage = function (event) {
    window.data = event.data
    $('#container-list').html(event.data)
}

function create_association() {
    $('#inputAssociationContainerName').on('input', () => {
        $('#inputAssociationContainerName').get(0).setCustomValidity('')
        $('#inputAssociationContainerName').get(0).reportValidity();
    })

    $('#inputAssociationBinaryName').on('input', () => {
        $('#inputAssociationBinaryName').get(0).setCustomValidity('')
        $('#inputAssociationBinaryName').get(0).reportValidity();
    })

    if (!(/^[\w\-]+$/.test($('#inputAssociationContainerName').val()))) {
        $('#inputAssociationContainerName').get(0).setCustomValidity('Container name may only contain alphanumeric characters and dashes (no spaces allowed).')
        $('#inputAssociationContainerName').get(0).reportValidity();
        return
    }

    if (!(/^[\w\-]+$/.test($('#inputAssociationBinaryName').val()))) {
        $('#inputAssociationBinaryName').get(0).setCustomValidity('Binary name may only contain alphanumeric characters and dashes (no spaces allowed).')
        $('#inputAssociationBinaryName').get(0).reportValidity();
        return
    }

    if (binary_names.includes($('#inputAssociationBinaryName').val())) {
        $('#inputAssociationBinaryName').get(0).setCustomValidity('Association already exists.')
        $('#inputAssociationBinaryName').get(0).reportValidity();
        return
    }

    fs.appendFile(require('os').homedir() + '/.local/bin/blend_bin/.associations', `${$('#inputAssociationBinaryName').val()}\0${$('#inputAssociationContainerName').val()}\n`, err => {
        require('child_process').spawnSync('ln', ['-sf', $('#inputAssociationBinaryName').val() + '.' + $('#inputAssociationContainerName').val(), require('os').homedir() + '/.local/bin/blend_bin/' + $('#inputAssociationBinaryName').val()])
        update_association_list()
        $('#inputAssociationContainerName').val('')
        $('#inputAssociationBinaryName').val('')
    })
}

function remove_association(binary_name) {
    require('child_process').spawnSync('bash', ['-c', `sed -i 's/^${binary_name}\\x0//g' ~/.local/bin/blend_bin/.associations`])
    require('child_process').spawnSync('rm', ['-f', require('os').homedir() + '/.local/bin/blend_bin/' + binary_name])
    update_association_list()
}

var binary_names = []

function update_association_list() {
    require('fs').readFile(require('os').homedir() + '/.local/bin/blend_bin/.associations', 'utf8', (err, data) => {
        let association_list_html = ''
        binary_names = []

        data.split('\n').forEach(line => {
            if (line.includes('\0')) {
                let binary_name = line.split('\0')[0]
                binary_names.push(binary_name)
                let container_name = line.split('\0')[1]
                console.log(binary_name, container_name)
                association_list_html += `
                <div class="list-group-item" style="padding: 11px 20px 11px 20px; border: 0.5px solid rgba(255, 255, 255, 0.05);">
                    <div class="row align-items-center">
                        <div class="col">
                            <strong class="mb-0 container_name">${binary_name} <span style="padding-left: 20px; padding-right: 20px;">&rarr;</span> ${container_name}</strong>
                        </div>
                        <div class="col-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" onclick="remove_association('${binary_name}')" style="cursor: pointer; z-index: 10;">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                        </div>
                    </div>
                </div>
                `
            }
        })

        if (association_list_html != '') {
            $('#association-list').html(association_list_html)
        } else {
            $('#association-list').html(`
            <div class="list-group-item">
                <div class="row align-items-center">
                    <div class="col">
                        <strong class="mb-0">No associations.</strong>
                        <p class="text-muted mb-0">Add one from above. It's recommended to add associations for each of the supported package managers for easier usage (apt, yum and dnf).</p>
                    </div>
                </div>
            </div>
            `)
        }
    })
}

update_association_list()
