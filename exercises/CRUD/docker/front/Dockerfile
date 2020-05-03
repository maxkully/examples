FROM node:10-stretch

USER ${FRONTEND_USER}

WORKDIR /usr/src/app

COPY ./apps/front /usr/src/app

# install dependencies
RUN yarn

EXPOSE 3000

ENTRYPOINT [ "yarn" ]

CMD [ "start" ]
