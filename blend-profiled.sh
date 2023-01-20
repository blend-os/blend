# shellcheck shell=sh

# Expand $PATH to include the directory where blend's package manager shortcuts
# are located.
blend_pkgmanager_bin_path="/blend/pkgmanagers"
if [ -n "${PATH##*${blend_pkgmanager_bin_path}}" ] && [ -n "${PATH##*${blend_pkgmanager_bin_path}:*}" ]; then
	export PATH="${blend_pkgmanager_bin_path}:${PATH}"
fi

# Start all the containers
blend start-containers &>/dev/null || :

if [[ ! -f "${HOME}/.disable_blend_msg" ]]; then
	shell_bold='\033[01m'
	shell_color_purple='\033[35m'
	shell_reset='\033[0m'

	echo -e "${shell_bold}Welcome to the ${shell_color_purple}blendOS${shell_reset}${shell_bold} shell!"

	echo -e "${shell_reset}note: if you don't want to see this message, you can create a file in your"
	echo -e "home directory named .disable_blend_msg${shell_bold}"
	echo

	echo -e 'Here are some useful commands:'
	echo -e "${shell_reset}To install a package (from the Arch repos and the AUR) in an Arch container:${shell_bold}"
	echo -e "  blend install <PKG>"
	echo -e "${shell_reset}To remove a package (from the Arch repos and the AUR) in an Arch container:${shell_bold}"
	echo -e "  blend remove <PKG>"
	echo -e "${shell_reset}To install a package (from the Arch repos and the AUR) in a Fecora container:${shell_bold}"
	echo -e "  blend install <PKG> -d fedora-rawhide"
	echo -e "${shell_reset}To enter a Fedora container:${shell_bold}"
	echo -e "  blend enter -cn fedora-rawhide"
	echo -e "${shell_reset}To update all the system packages:${shell_bold}"
	echo -e "  blend system-update${shell_reset} (do not use 'pacman -Syu', as it will only update the"
	echo -e "    packages in the Arch container)"
	echo -e "${shell_reset}To list all the containers:${shell_bold}"
	echo -e "  blend list-containers"

	echo -e "Keep in mind that none of these commands should be run as root."

	echo
	echo -e "${shell_reset}Most apps installed through blend will automatically appear in the applications"
	echo -e "list. However, if they don't, you can always manually export them by running:"
	echo -e "  ${shell_bold}blend export [DESKTOP FILE WITHOUT EXTENSION]${shell_reset}"
	echo

	echo -e "You can always specify a distribution (default is arch) by appending ${shell_bold}"
	echo -e "--distro=[DISTRO]${shell_reset} to the end of a blend command."
	echo -e "(for example: ${shell_bold}blend install hello --distro=ubuntu-22.10)${shell_reset}"
	echo
	echo -e "Here are the supported distributions:"
	echo -e "${shell_bold}1.${shell_reset} arch (default)"
	echo -e "${shell_bold}2.${shell_reset} fedora-rawhide"
	echo -e "${shell_bold}3.${shell_reset} ubuntu-22.04"
	echo -e "${shell_bold}4.${shell_reset} ubuntu-22.10"
	echo -e "You can also specify a custom container name (default is the distro's name) by"
	echo -e "appending ${shell_bold}--container-name=[CONTAINER]${shell_reset} to the end of a blend command."

	echo
	echo -e "You can also use these packages managers directly:"
	echo -e "${shell_bold}1.${shell_reset} pacman/yay (distro: arch)"
	echo -e "${shell_bold}2.${shell_reset} apt/apt-get (distro: ubuntu-22.10)"
	echo -e "${shell_bold}3.${shell_reset} dnf/yum (distro: fedora-rawhide)"
	echo -e "However, you'll need to manually export the desktop files"
	echo -e "for packages installed this way, by running:"
	echo -e "  ${shell_bold}blend export [DESKTOP FILE WITHOUT EXTENSION] --distro=[DISTRO]${shell_reset}"

	echo
	echo -e "For more information about ${shell_color_purple}blend${shell_reset}${shell_bold}, run:"
	echo -e "  blend help"

	echo -e "${shell_reset}"
fi
