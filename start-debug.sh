#!/bin/bash
set -e
set -u

node --debug-brk=5858 src/lib/eyeos-user-guest-status-polling-service.js