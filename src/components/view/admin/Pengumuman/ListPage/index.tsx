"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Pengumuman } from "@/type/Pengumuman.type";
import CardsSkeleton from "@/components/ui/skeleton/card";
import { formatCreatedAt } from "@/utils/formatdate";

type Props = {
  data: Pengumuman[];
  loadingFetch: boolean;
  setEditData: React.Dispatch<React.SetStateAction<Pengumuman>>;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PengumumanList(prop: Props) {
  const { data, loadingFetch, setEditData, setEditModal } = prop;
  // format YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toISOString().split("T")[0];
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    return formatDate(dateString) === today;
  };

  const isYesterday = (dateString: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(dateString) === yesterday.toISOString().split("T")[0];
  };

  const formatLabel = (dateString: string) => {
    if (isToday(dateString)) return "Hari Ini";
    if (isYesterday(dateString)) return "Kemarin";

    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // group by tanggal
  const grouped = data.reduce((acc: any, item: Pengumuman) => {
    const date = new Date(item.start_date).toISOString().slice(0, 10);

    if (!acc[date]) acc[date] = [];
    acc[date].push(item);

    return acc;
  }, {});

  // sort tanggal terbaru
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const handleEditPengumuman = (item: Pengumuman) => {
    setEditData(item);
    setEditModal(true);
  };

  return (
    <Box className="flex flex-col gap-8 w-full mx-auto">
      {loadingFetch && <CardsSkeleton />}
      {sortedDates.map((date) => (
        <Box key={date}>
          {/* Judul tanggal */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 18,
              mb: 3,
              color:
                formatLabel(date) === "Hari Ini"
                  ? "var(--primary-color)"
                  : formatLabel(date) === "Kemarin"
                    ? "var(--secondary-light)"
                    : "var(--secondary-dark)",
            }}
          >
            {formatLabel(date)}
          </Typography>

          {/* Timeline */}
          <Box className="flex flex-col gap-4 border-l-2 border-gray-200 pl-6">
            {grouped[date].map((item: Pengumuman) => (
              <Box key={item.id} className="relative">
                {/* Icon timeline */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "-38px",
                    top: "18px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--primary-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <CampaignIcon fontSize="small" />
                </Box>

                {/* Card */}
                <Card
                  sx={{
                    borderRadius: "14px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "all .2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent>
                    <div className="flex justify-between items-center">
                      {/* Title */}
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          mb: 1,
                        }}
                      >
                        {item.title}
                      </Typography>
                      {/* Tanggal dibuat */}
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                          mb: 1.5,
                        }}
                      >
                        Dibuat: {formatCreatedAt(item.created_at)}
                      </Typography>
                    </div>
                    {/* Content */}
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 14,
                        mb: 2,
                      }}
                    >
                      {item.content}
                    </Typography>
                    <div className="flex justify-between items-center">
                      {/* Tujuan */}
                      <Box className="flex flex-wrap gap-2">
                        {item.target
                          ?.split(",")
                          .map((t: string) => t.trim())
                          .filter(Boolean)
                          .map((t: string, i: number) => (
                            <Chip
                              key={i}
                              label={t}
                              size="small"
                              sx={{
                                background: "#EEF2FF",
                                color: "var(--primary-color)",
                                fontWeight: 500,
                              }}
                            />
                          ))}
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          mt: 2,
                          background: "var(--primary-color)",
                          color: "#fff",
                          borderRadius: "10px",
                          "&:hover": {
                            background: "var(--primary-color)",
                          },
                        }}
                        onClick={() => handleEditPengumuman(item)}
                      >
                        Edit Pengumuman
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
