#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./audit-detail.sh <audit_id>"
  exit 1
fi

curl -X GET http://localhost:3000/audit/$1