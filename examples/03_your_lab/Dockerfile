FROM kalilinux/kali-rolling

RUN apt update && apt install -y figlet openssh-server zsh nano fastfetch sudo zsh zsh-autosuggestions

RUN ssh-keygen -A

RUN echo "k8ute" | figlet > /etc/motd && echo "Happy hacking!" >> /etc/motd

RUN adduser k8ute

RUN echo "k8ute:k8ute" | chpasswd

RUN chsh -s /bin/zsh k8ute

RUN echo "k8ute ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

CMD ["/usr/sbin/sshd", "-D"]