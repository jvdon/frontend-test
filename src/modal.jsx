import { Box, Modal } from "@mui/material";
import { useState } from "react";

export default function CustomModal(user) {
    let [open, setOpen] = useState(true);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        bgcolor: '#202020',
        border: '2px solid #000',
        color: "#FFF",
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onClose={() => { setOpen(false) }}
            >
            <Box sx={style}>
                <h1>{user["name"]}</h1>
                <h2>Name: {user["name"]}</h2>
                <h2>Username: {user["username"]}</h2>
                <h2>Email: {user["email"]}</h2>
                <h2>Phone: {user["phone"]}</h2>
                <h2>Address: {user["address"]["street"]}, {user["address"]["city"]}</h2>
                <h2>Company: {user["company"]["name"]}</h2>
                <p>Slogan: {user["company"]["catchPhrase"]}</p>
            </Box>
        </Modal>
    );
}