var term

function open_container(name) {
    ipc.send("create-term", { 'title': `Container: ${name}`, 'cmd': `blend enter -cn ${name}` });
}

function create_container () {
    container_name = $('#inputContainerName').val()
    if (!(/^[\w\-\.]+$/.test(container_name))) {
        $('#inputContainerName').get(0).setCustomValidity('Container name can only contain alphanumeric characters and dashes (no spaces allowed).')
        $('#inputContainerName').get(0).reportValidity();
        return
    }
    container_distro = $('#inputContainerDistro').val().toLowerCase().replace(' ', '-')
    ipc.send("create-term", { 'title': `Creating container: ${container_name}`,
                              'cmd': `blend create-container -cn ${container_name} -d ${container_distro} \
                                      && echo 'created container successfully (exiting automatically in 5 seconds)' \
                                      || echo 'container creation failed (exiting automatically in 5 seconds)';
                                      sleep 5` });
    ipc.on('container-created', () => {
        worker.postMessage('update-list')
    })
}

async function remove_container (name) {
    let rm_worker = new Worker(
        `data:text/javascript,
        require('child_process').spawnSync('podman', ['stop', '-t', '0', '${name}'], { encoding: 'utf8' })
        require('child_process').spawnSync('podman', ['rm', '-f', '${name}'], { encoding: 'utf8' })
        postMessage('')
        `
    )
    rm_worker.onmessage = e => worker.postMessage('update-list')
}

window.worker = new Worker(
    `data:text/javascript,
    function list_containers() {
        let container_list = require('child_process').spawnSync('podman', ['ps', '-a', '--no-trunc', '--size', '--format', '{{.Names}}'], { encoding: 'utf8' }).stdout.split(/\\r?\\n/).filter(Boolean).reverse();
        if (require('fs').existsSync(require('path').join(require('os').homedir(), '.config/blend/config.yaml'), 'utf8')) {
            try {
                let fileContents = require('fs').readFileSync(require('path').join(require('os').homedir(), '.config/blend/config.yaml'), 'utf8')
                let data = require('js-yaml').load(fileContents);
                new_container_list = data['container_order']
                container_list.forEach(container => {
                    if (!new_container_list.includes(container)) {
                        new_container_list.push(container)
                    }
                });
                new_container_list = new_container_list.filter(container => container_list.includes(container))
                new_container_list.filter((item, index) => arr.indexOf(item) === index)
                data = {
                    container_order: [...new_container_list],
                    use_container_bins: []
                };
                contents = require('js-yaml').dump(data)
                require('fs').writeFileSync(require('path').join(require('os').homedir(), '.config/blend/config.yaml'), contents, 'utf8')
                return new_container_list
            } catch (e) {
                let data = {
                    container_order: [...container_list],
                    use_container_bins: []
                };
                contents = require('js-yaml').dump(data)
                require('fs').writeFileSync(require('path').join(require('os').homedir(), '.config/blend/config.yaml'), contents, 'utf8')

                return container_list
            }
        } else {
            let data = {
                container_order: [...container_list],
                use_container_bins: []
            };
            require('fs').mkdirSync(require('path').join(require('os').homedir(), '.config/blend'), { recursive: true });
            contents = require('js-yaml').dump(data)
            require('fs').writeFileSync(require('path').join(require('os').homedir(), '.config/blend/config.yaml'), contents, 'utf8')

            return container_list
        }
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
                    <p class="text-muted mb-0">Create one from below.</p>
                </div>
            </div>
        </div>
        \`

        container_list_html = ''

        container_list.forEach(container => {
            container_list_html += \`
            <div class="list-group-item" style="padding-top: 10px; padding-bottom: 10px; border: 0.5px solid rgba(255, 255, 255, 0.05);">
                <div class="row align-items-center" style="cursor: grab;">
                    <div class="col">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16" style="margin-right: 12px;">
                            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                        <strong class="mb-0 container_name">\${container}</strong>
                    </div>
                    <div class="col-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16" onclick="open_container('\${container}')" style="cursor: pointer; margin-right: 8px;">
                        <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" onclick="remove_container('\${container}')" style="cursor: pointer; margin-right: 20px; z-index: 10;">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
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
    if (event.data.includes('bi-grip-vertical')) {
        $('#container-list').addClass('sortable')
        $('#container-list').html(event.data)
    } else {
        $('#container-list').removeClass('sortable')
        $('#container-list').html(event.data)
    }

    $('.sortable').each((i, e) => {
        Sortable.create(e, {
            animation: 100,
            onEnd: () => {
                let container_list = []
                $('.container_name').each((i, e) => {
                    container_list.push(e.innerText)
                })
                let data = {
                    container_order: [...container_list],
                    use_container_bins: []
                };
                require('fs').mkdirSync(require('path').join(require('os').homedir(), '.config/blend'), { recursive: true });
                contents = require('js-yaml').dump(data)
                require('fs').writeFileSync(require('path').join(require('os').homedir(), '.config/blend/config.yaml'), contents, 'utf8')
            }
        });
        e.addEventListener("dragstart", e => e.dataTransfer.setDragImage(new Image(), 0, 0), false);
    })
}