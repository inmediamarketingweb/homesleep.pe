#!/bin/bash

set -e

LOG_FILE="deploy_error.log"
TOTAL_STEPS=7
CURRENT_STEP=0
BAR_WIDTH=40

progress_bar() {
  local progress=$1
  local total=$2
  local percent=$(( progress * 100 / total ))
  local filled=$(( progress * BAR_WIDTH / total ))
  local empty=$(( BAR_WIDTH - filled ))

  printf "\r["
  printf "%0.s█" $(seq 1 $filled)
  printf "%0.s░" $(seq 1 $empty)
  printf "] %d%%" "$percent"
}

run_step() {
  local msg="$1"
  shift

  CURRENT_STEP=$((CURRENT_STEP + 1))
  echo -e "\n🔹 $msg"

  (
    "$@" >"$LOG_FILE" 2>&1
  ) &
  CMD_PID=$!

  while kill -0 "$CMD_PID" 2>/dev/null; do
    progress_bar "$CURRENT_STEP" "$TOTAL_STEPS"
    sleep 0.1
  done

  wait "$CMD_PID" || {
    echo -e "\n❌ ERROR en: $msg"
    echo "📄 Detalle del error:"
    echo "----------------------------------------"
    cat "$LOG_FILE"
    echo "----------------------------------------"
    exit 1
  }

  echo -e "\n✔ $msg completado"
}

echo "🚀 INICIANDO DEPLOY – homesleep.pe"
echo "================================="

cd /var/www/homesleep.pe || {
  echo "❌ No se pudo acceder al directorio"
  exit 1
}

run_step "Reset del repositorio" git reset --hard
run_step "Limpieza de archivos" git clean -fd
run_step "Actualizando código (git pull)" git pull origin main
run_step "Instalando dependencias" npm install
run_step "Eliminando build anterior" rm -rf build
run_step "Generando nueva build" npm run build
run_step "Ajustando permisos" chown -R www-data:www-data .

echo -e "\n================================="
echo "✅ DEPLOY FINALIZADO CON ÉXITO"
echo "🌐 homesleep.pe actualizado correctamente"
echo "================================="
