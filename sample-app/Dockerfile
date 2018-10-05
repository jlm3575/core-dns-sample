FROM node:7.9.0
COPY ./* /opt/sample-app/
# Keep this at the highest layer since it's most likely to change
RUN cd /opt/sample-app && npm install
CMD node /opt/sample-app/app.js
