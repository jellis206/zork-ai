import type { MetaFunction } from "@remix-run/node";
import styles from "~/styles/main.css";
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Zork-AI!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Zork-AI</h1>
      <Button variant="contained">Contained</Button>
      <Card style={{ maxWidth: 345 }}>
        <CardActionArea component={Link} to="/new-page">
          <CardMedia
            component="img"
            height="140"
            image="~/lib/36E58462-0C44-47B3-BB3B-6C9F2E48379A.jpeg"
            alt="Play"
          />
          <Typography gutterBottom variant="h5" component="div">
            Sci-Fi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conquer the cosmos. Are you up for the challenge?
          </Typography>
        </CardActionArea>
      </Card>
    </div>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
