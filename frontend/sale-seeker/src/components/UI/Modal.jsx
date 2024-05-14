import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";

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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="backdrop"
        />
      )}
      <motion.dialog
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 30 }}
        exit={{ opacity: 0, y: 30 }}
        className={`modal-class ${className}`}
        onClose={onClose}
        ref={dialog}
        key="modal"
      >
        <div className="modal-close-btn" onClick={onClose}>
          <IoCloseCircleOutline />
        </div>
        {children}
      </motion.dialog>
    </AnimatePresence>,
    document.getElementById("modal")
  );
}
