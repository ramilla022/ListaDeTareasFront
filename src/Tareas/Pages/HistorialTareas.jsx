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

const iconoDescripcion = (descripcion) => {
  if (descripcion.toLowerCase().includes("creada")) {
    return <AddCircleOutlineIcon sx={{ color: "green" }} />;
  }
  if (descripcion.toLowerCase().includes("modificada")) {
    return <EditOutlinedIcon sx={{ color: "orange" }} />;
  }
  if (descripcion.toLowerCase().includes("eliminada")) {
    return <DeleteOutlineIcon sx={{ color: "red" }} />;
  }
  return <EventNoteIcon sx={{ color: "gray" }} />;
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
      <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
        Historial de Tareas
      </Typography>

      {historialAgrupado.length === 0 && (
        <Typography textAlign="center" color="text.secondary">
          No hay eventos en el historial.
        </Typography>
      )}

      {historialAgrupado.map((grupo) => (
        <Paper key={grupo.fecha} sx={{ p: 2, mb: 4, bgcolor: "#f9f9f9" }} elevation={1}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1} display="flex" alignItems="center" gap={1}>
            <EventNoteIcon color="primary" />
            {format(parseISO(grupo.fecha), "PPP", { locale: es })}
          </Typography>

          <List dense>
            {grupo.eventos.map((evento, index) => (
              <React.Fragment key={index}>
                <ListItem disablePadding>
                  <ListItemIcon>{iconoDescripcion(evento.descripcion)}</ListItemIcon>
                  <ListItemText
                    primary={evento.descripcion}
                    primaryTypographyProps={{ fontSize: 14 }}
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