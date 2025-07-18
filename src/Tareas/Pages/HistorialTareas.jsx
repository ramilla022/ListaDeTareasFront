import React, { useMemo } from "react";
import { useTareas } from "../../Context/TareasContext";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Paper,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const iconoDescripcion = (accion) => {
  if (!accion || typeof accion !== "string")
    return <EventNoteIcon sx={{ color: "gray" }} />;

  const a = accion.trim().toLowerCase();

  if (a === "crear") {
    return <AddCircleOutlineIcon sx={{ color: "green" }} />;
  }
  if (a === "modificar") {
    return <EditOutlinedIcon sx={{ color: "orange" }} />;
  }
  if (a === "eliminar") {
    return <DeleteOutlineIcon sx={{ color: "red" }} />;
  }
  return <EventNoteIcon sx={{ color: "gray" }} />;
};

const formatearDetalle = (datos) => {
  if (!datos || typeof datos !== "object") return "";

  const lineas = [];

  if (datos.descripcion) lineas.push(`Descripción: ${datos.descripcion}`);
  if (datos.tipo) lineas.push(`Tipo: ${datos.tipo}`);
  if (datos.estado) lineas.push(`Estado: ${datos.estado}`);

  if (datos.fechaCreacion) {
    try {
      const fecha = format(parseISO(datos.fechaCreacion), "PPP p", { locale: es });
      lineas.push(`Fecha creación: ${fecha}`);
    } catch {
      lineas.push(`Fecha creación: ${datos.fechaCreacion}`);
    }
  }
  if (datos.fechaModificacion) {
    try {
      const fecha = format(parseISO(datos.fechaModificacion), "PPP p", { locale: es });
      lineas.push(`Fecha modificación: ${fecha}`);
    } catch {
      lineas.push(`Fecha modificación: ${datos.fechaModificacion}`);
    }
  }

  if (datos.antes && typeof datos.antes === "object") {
    if (datos.antes.descripcion) lineas.push(`Antes - Descripción: ${datos.antes.descripcion}`);
    if (datos.antes.tipo) lineas.push(`Antes - Tipo: ${datos.antes.tipo}`);
    if (datos.antes.estado) lineas.push(`Antes - Estado: ${datos.antes.estado}`);
  }
  if (datos.despues && typeof datos.despues === "object") {
    if (datos.despues.descripcion) lineas.push(`Después - Descripción: ${datos.despues.descripcion}`);
    if (datos.despues.tipo) lineas.push(`Después - Tipo: ${datos.despues.tipo}`);
    if (datos.despues.estado) lineas.push(`Después - Estado: ${datos.despues.estado}`);
  }

  if (lineas.length === 0) return "Sin detalles específicos.";

  return lineas.join("\n");
};

const HistorialTareas = () => {
  const { historial } = useTareas();

  const historialAgrupado = useMemo(() => {
    if (!historial || !Array.isArray(historial)) return [];

    const mapa = {};

    historial.forEach((evento) => {
      if (!evento.fecha) return;
      const fecha = parseISO(evento.fecha);
      const clave = format(fecha, "yyyy-MM-dd");

      if (!mapa[clave]) mapa[clave] = [];
      mapa[clave].push({ ...evento, fecha });
    });

    return Object.entries(mapa)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .map(([fecha, eventos]) => ({
        fecha,
        eventos: eventos.sort((a, b) => b.fecha - a.fecha),
      }));
  }, [historial]);

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography
        variant="h5"
        gutterBottom
        fontWeight="bold"
        textAlign="center"
      >
        Historial de Tareas
      </Typography>

      {historialAgrupado.length === 0 && (
        <Typography textAlign="center" color="text.secondary">
          No hay eventos en el historial.
        </Typography>
      )}

      {historialAgrupado.map((grupo) => (
        <Paper
          key={grupo.fecha}
          sx={{ p: 2, mb: 4, bgcolor: "#f9f9f9" }}
          elevation={1}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            mb={1}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <EventNoteIcon color="primary" />
            {format(parseISO(grupo.fecha), "PPP", { locale: es })}
          </Typography>

          <List dense>
            {grupo.eventos.map((evento, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemIcon>{iconoDescripcion(evento.accion)}</ListItemIcon>
                  <ListItemText
                    primary={`Tarea ${evento.accion} - ID: ${evento.tareaId}`}
                    secondary={formatearDetalle(evento.datos)}
                    primaryTypographyProps={{ fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 13, whiteSpace: "pre-line" }}
                  />
                </ListItem>
                {index !== grupo.eventos.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default HistorialTareas;