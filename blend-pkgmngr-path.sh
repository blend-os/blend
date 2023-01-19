# shellcheck shell=sh

# Expand $PATH to include the directory where blend's package manager shortcuts
# are located.
blend_pkgmanager_bin_path="/blend/pkgmanagers"
if [ -n "${PATH##*${blend_pkgmanager_bin_path}}" ] && [ -n "${PATH##*${blend_pkgmanager_bin_path}:*}" ]; then
    export PATH="${blend_pkgmanager_bin_path}:${PATH}"
fi

