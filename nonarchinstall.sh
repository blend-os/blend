DESTINATION=/usr
FOLDERNAME=usr
OVERLAY=
if ! [ $(id -u) = 0 ]; then
   echo "The script need to be run as root." >&2
   exit 1
fi

if [ $SUDO_USER ]; then
    real_user=$SUDO_USER
else
    real_user=$(whoami)
fi

    curl -s https://api.github.com/repos/electron/electron/releases/latest \
    | grep "browser_download_url.*electron-.*-linux-x64.zip" \
    | cut -d : -f 2,3 \
    | tr -d \" \
    | wget -qi -
    unzip -q -o '*electron*.zip' -d electron22
    sudo -u ${real_user} git clone https://github.com/blend-os/blend-pkg
    sudo cp -R electron22 ${OVERLAY}${DESTINATION}/lib/
    cd blend-pkg
    sudo -u ${real_user} makepkg --nodeps
    for f in *.tar.gz; do \
		tar xzf "$f"; \
    done 
    mv usr -Tf blendWorkspace 
    mv blendWorkspace -Tf ${FOLDERNAME} 
    sudo cp -RT ${FOLDERNAME} ${OVERLAY}/${FOLDERNAME} 
    sudo cp -RT etc /etc
    cd /etc/profile.d 
    chmod +x blend.sh 
    sudo -u ${real_user} ./blend.sh
    cd ${OVERLAY}/${FOLDERNAME}/lib/systemd/user 
    ls
    sudo -u ${real_user} systemctl --user enable blend-files.service
