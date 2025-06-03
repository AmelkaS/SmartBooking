import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import axiosInstance from '../utils/axiosInstance';

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({});
  const [anchorEls, setAnchorEls] = useState({});

  const fetchReservations = async () => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.get("http://localhost:8000/api/reservations/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReservations(response.data);
    setFiltered(response.data);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleApprove = async (id: number) => {
    const token = localStorage.getItem("access_token");
    await axiosInstance.patch(
      `http://localhost:8000/api/reservations/${id}/status/`,
      { status: "APPROVED" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchReservations();
  };

  const openMenu = (e: any, key: string) => {
    setAnchorEls((prev) => ({ ...prev, [key]: e.currentTarget }));
  };

  const applyFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setFiltered(
      reservations.filter((r) =>
        Object.entries(newFilters).every(([k, v]) => r[k] === v)
      )
    );
    setAnchorEls((prev) => ({ ...prev, [key]: null }));
  };

  const clearFilter = (key: string) => {
    const { [key]: _, ...rest } = filters;
    setFilters(rest);
    setFiltered(
      reservations.filter((r) =>
        Object.entries(rest).every(([k, v]) => r[k] === v)
      )
    );
    setAnchorEls((prev) => ({ ...prev, [key]: null }));
  };

  const columns = [
    { key: "user_email", label: "Użytkownik" },
    { key: "room_name", label: "Sala" },
    { key: "start_time", label: "Początek" },
    { key: "end_time", label: "Koniec" },
    { key: "student_count", label: "Studenci" },
    { key: "status", label: "Status" },
  ];

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" mb={2}>Lista rezerwacji</Typography>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.label}
                <IconButton size="small" onClick={(e) => openMenu(e, col.key)}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEls[col.key]}
                  open={Boolean(anchorEls[col.key])}
                  onClose={() => setAnchorEls((prev) => ({ ...prev, [col.key]: null }))}
                >
                  <MenuItem onClick={() => clearFilter(col.key)}>Wyczyść filtr</MenuItem>
                  {Array.from(new Set(reservations.map((r) => r[col.key]))).map((val) => (
                    <MenuItem key={val} onClick={() => applyFilter(col.key, val)}>
                      {String(val)}
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((r: any) => (
            <TableRow key={r.id}>
              <TableCell>{r.user_email}</TableCell>
              <TableCell>{r.room_name}</TableCell>
              <TableCell>{r.start_time}</TableCell>
              <TableCell>{r.end_time}</TableCell>
              <TableCell>{r.student_count}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>
                {r.status === "PENDING" && localStorage.getItem("role") === "ADMIN" && (
                  <Button onClick={() => handleApprove(r.id)} variant="outlined" size="small">
                    Zatwierdź
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
