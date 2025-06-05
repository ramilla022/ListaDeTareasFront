import { Box, TextField, MenuItem } from "@mui/material";

export default function FormularioTarea({
  descripcion,
  setDescripcion,
  tipo,
  setTipo,
  estado,
  fechaCreacion,
}) {
  return (
    <Box noValidate sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        inputProps={{ maxLength: 100 }}
        helperText={`${descripcion.length}/100`}
        required
        margin="normal"
        multiline
        sx={{
          textarea: { resize: "vertical" },
        }}
      />

      <TextField
        select
        fullWidth
        label="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        margin="normal"
      >
        <MenuItem value="Hogar">Hogar</MenuItem>
        <MenuItem value="Trabajo">Trabajo</MenuItem>
        <MenuItem value="Estudio">Estudio</MenuItem>
        <MenuItem value="Varias">Varias</MenuItem>
      </TextField>

      <TextField
        label="Estado"
        fullWidth
        value={estado}
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        label="Fecha de creación"
        fullWidth
        value={fechaCreacion}
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
    </Box>
  );
}