FROM docker-registry.eyeosbcn.com/alpine6-node-base

ENV WHATAMI user-guest-status-polling-service

ENV InstallationDir /var/service/

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf /var/service/src/lib/eyeos-user-guest-status-polling-service.js

COPY . ${InstallationDir}

RUN /scripts-base/buildDependencies.sh --production --install && \
    npm install --verbose --production && \
    npm cache clean && \
    /scripts-base/buildDependencies.sh --production --purgue && \
    rm -r /etc/ssl /var/cache/apk/* /tmp/*
