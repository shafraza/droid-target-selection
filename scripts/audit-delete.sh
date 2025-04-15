#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./audit-delete.sh <audit_id>"
  exit 1
fi

curl -X DELETE http://localhost:3000/audit/$1