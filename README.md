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

Both methods require `podman` as a dependency.

## Building Manually

To build manually, you are going to need the following dependencies:

pacman fakeroot git binutils npm electron(maunaully downloaded from github, see later) bzip2 make gcc

Install the dependentcies from your package manager except for electron

i.e sudo dnf install pacman fakeroot git binutils npm bzip2 make gcc

Clone the repo for building blend

git clone https://github.com/blend-os/blend-pkg

Then download electron from https://github.com/electron/electron/releases/download/v24.2.0/electron-v24.2.0-linux-x64.zip

Extract the zip and rename it to electron22

Go to where you downloaded it

cd Downloads

Copy it to /usr/lib (on mutable systems)

sudo cp electron22 -R /usr/lib

On immutable systems, you will need to edit the pkgbuild in blend-pkg to set a different directory

Go to blend-pkg

cd blend-pkg

Edit the file with editor of choice

(text editor) PKGBUILD

Edit this line to a directory you can copy to

electronVer="$(sed s/^v// /usr/lib/electron${_electronversion}/version)"

i.e on silverblue /var/usrlocal/lib/electron

Go back to home

cd 

Go to where you downloaded it

cd Downloads

Then copy to chosen directory

sudo cp electron22 -R /var/usrlocal

Go back to home

cd

Go to the blend-pkg folder

cd blend-pkg

This is where the guide splits from Arch to non Arch

##Arch

Install podman from your distro's repo.

Proceed building the package and installing it and any missing dependentcies(if you forgot) with

makepkg -si

The reason why this is the arch version is that -s uses pacman to install dependetcies, which on non arch wouldnt work, and -i would install as a Arch app

may have unintended consequences on non arch.

run the /etc/profile.d/blend.sh  to set the path

Go to location

cd /etc/profile.d/blend.sh 

Set the sh as executable

chmod +x blend.sh

Run the script

./blend.sh

Enable the blend-files service

cd /usr/lib/systemd/user

systemctl --user enable blend-files.service

#Done

##Non Arch

Proceed building the app with

makepkg --nodeps

Once that is done, head over to #Installation

## Prebuilts

Download the two tar files under releases

Mutable systems install npm from your distros repo

Then use npm install electron -g

Head to # Installation

Immutable systems use below instructions for electron

Download electron from https://github.com/electron/electron/releases/download/v24.2.0/electron-v24.2.0-linux-x64.zip

Extract the zip and rename it to electron22

Go to where you downloaded it

cd Downloads

Copy it to overlay for /usr/lib; in silverblue its /var/usrlocal/lib

sudo cp electron22 -R /var/usrlocal/lib

Head to # Installation 

## Installation

Install podman from your distro's repo.

Extract the new tar files to the their own folders

e.g. (blend-git... and blend-settings-git...)

Create a new folder named workspaceBlend

copy all the contents of the extracted tar files to workspaceBlend; merge the folders and skip the replace(dont need buildinfo,mtree or pkginfo)

(so each extracted tar has its own usr directory, so copying that to workpaceBlend will merge them)

Here comes another split

On mutable distros,copy the usr folder to /usr and the etc folder to /etc; merge the folders

Enter workspaceBlend

cd workspaceBlend

sudo cp usr -R /usr

sudo cp etc -R /etc

On immutable distros, rename the /usr folder to what you need based on the overlay filesystem setup you have

On silverblue you would rename to usrlocal and copy to /var/usrlocal; merge the folders

sudo cp usrlocal -R /var/usrlocal

Do the same with /etc if you need

You dont need to on Silverblue though so proceed as normal.

sudo cp etc -R /etc

run the /etc/profile.d/blend.sh  to set the path

Go to location

cd /etc/profile.d/blend.sh 

Set the sh as executable

chmod +x blend.sh

Run the script

./blend.sh

Enable the blend-files service

cd /usr/lib/systemd/user

systemctl --user enable blend-files.service


Thats the main Install, some goodies below

To start on log in add the following to .bash_profile


blend start-containers




             





