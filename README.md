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

## Installation
Install podman from your distro's repo.
i.e sudo dnf install podman

Clone the files to the computer:
git clone https://github.com/lilkidsuave/blendGuide && cd blendGuide

Copy the following to eithier /home/(user)/.local/bin or /usr/bin

blend
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

Now enter the overlayfs-tools directory
cd overlayfs-tools

Make the package inside
make

Take ownership of /usr/libexec/initcripts
sudo chown (user) -R /usr/libexec/initscripts

Enable the blend-files.service

systemctl enable blendfiles.service

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

to install the gui you need to copy a couple more files and install electron and node js.
 
Install nodejs.
i.e. sudo dnf install nodejs
 
Install Electron
i.e sudo npm install electron -g

Return to main Directory with cd
 
Go back to blend folder
cd blend

Copy the blend-settings.asar to /usr/lib

sudo cp blend-settings.asar /usr/lib

Copy the blend-settings executable to /usr/bin or home/(user)/local/bin

sudo cp blend-settings /usr/bin



Thats the main Install, some goodies below

To start on log in add the following to .bash_profile
blend start-containers
blend-files &
disown blend-files

To add to application launcher, move the .desktop to /usr/share/applications
sudo cp blend-settings.desktop /usr/share/applications
 

             





