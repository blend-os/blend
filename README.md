<div align="center">
  <h1 align="center">blend</h1>
  <p align="center">A tool to manage overlays, containers and multiple distributions</p>
</div>

This repository also contains **blend-settings**, a tool for configuring blend and overlays, as well as many other utilities. 

## Credits

The `init-blend` file in this repository uses a few lines (the sections have been marked clearly) uses from distrobox's init script. These lines have been marked and attributed appropriately, and are licensed under [the GPL-3.0 license](https://github.com/89luca89/distrobox/blob/main/COPYING.md).

I would also like to thank Luca Di Maio from Distrobox for NVIDIA driver support in containers.

`overlayfs-tools` has been taken from https://github.com/ecdye/zram-config, which itself forked https://github.com/kmxz/overlayfs-tools.

Aside from these lines, all the other code in this repository has been written by me (rs2009). `blend-settings` is based on [Modren](https://github.com/RudraSwat/modren), a software store I (rs2009) had written long ago, and is licensed under the same license as the rest of the code in this repository, [the GPL-3.0 license](https://github.com/blend-os/blend/blob/main/LICENSE).

## Usage

It's recommended to use the `blend-settings` UI, instead of the `blend` CLI.

#Installation
install podman from your distro's repo.
i.e sudo dnf install podman
Clone the files to the computer:
git clone https://github.com/lilkidsuave/blendGuide && cd blendGuide
Copy the following to eithier /home/(user)/.local/bin or /usr/bin

blend-files
blend-system
blend.hook
blend.install
host-blend
init-blend 
blend-settings

sudo cp blend-files blend-system blend.hook blend.install host-blend init-blend blend-settings

Copy the service file to /etc/systemd/system
sudo cp blend-files.service /etc/systemd/system

Take ownership of /usr/libexec/initcripts
sudo chown (user) -R /usr/libexec/initscripts

The cli is done.

possible commands are as follows

                'enter': enter_container,
                'exec': enter_container,
                'create-container': core_create_container,
                'remove-container': remove_container,
                'list-containers': list_containers,
                'start-containers': start_containers,
                'sync': sync_blends,
                'help': 'help',
                'version': 'version' }
                'command', choices=command_map.keys(), help=argparse.SUPPRESS)
                'pkg', action='store', type=str, nargs='*', help=argparse.SUPPRESS)
                '-cn', '--container-name', action='store', nargs=1, metavar='CONTAINER NAME', help=argparse.SUPPRESS)
                '-y', '--noconfirm', action='store_true', help=argparse.SUPPRESS)
                '-d', '--distro', action='store', nargs=1, metavar='DISTRO', help=argparse.SUPPRESS)
                '-v', '--version', action='version', version=f'%(prog)s {__version}', help=argparse.SUPPRESS)
           
             





