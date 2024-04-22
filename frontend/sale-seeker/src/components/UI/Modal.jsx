import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function Modal({ children, open, onClose, className = "" }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  }, [open]);

  return createPortal(
    <motion.dialog
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : 30 }}
      exit={{ opacity: 0, y: 30 }}
      className={`modal-class ${className}`}
      onClose={onClose}
      ref={dialog}
    >
      {children}
    </motion.dialog>,
    document.getElementById("modal")
  );
}
