import { Paper, Stack, Typography } from "@mui/material";

export default function MessageBubble({ userName, content, mine = true }) {
  return (
    <Stack direction={ mine ? 'row-reverse' : 'row' }>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography sx={{ mb:2, color: 'text.secondary' }} >{ userName }:</Typography>
        <Typography>{content}</Typography>
      </Paper>
    </Stack>
  )
}
