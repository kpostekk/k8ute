FROM alpine:3 AS alpine-hacker-base

RUN apk add openssh zsh grml-zsh-config shadow figlet neovim nano

RUN echo "k8ute" | figlet > /etc/motd && echo "Happy hacking!" >> /etc/motd

RUN ssh-keygen -A

RUN echo "root:root" | chpasswd

RUN adduser -D -s /bin/sh k8ute

RUN echo "k8ute:k8ute" | chpasswd

RUN chsh -s /bin/zsh k8ute

CMD ["/usr/sbin/sshd", "-D"]



FROM alpine-hacker-base AS vector

RUN apk add nodejs python3 python3-pip



FROM alpine:3 AS secret-source

COPY secret-source.sh /secret-source.sh

RUN chmod +x /secret-source.sh

CMD ["ash", "/secret-source.sh"]