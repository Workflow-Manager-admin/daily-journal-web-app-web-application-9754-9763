#!/bin/bash
cd /home/kavia/workspace/code-generation/daily-journal-web-app-web-application-9754-9763/web_application
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

