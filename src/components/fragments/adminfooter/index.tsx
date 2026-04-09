import React from "react";

const AdminFooter = () => {
  return (
    <div className="left-0 w-full text-center mt-5 text-gray-500">
      <i className="text-xs text-black">
        This site is protected by{" "}
        <span className="text-secondary">reCAPTCHA</span> and the Google Privacy
        Policy and Terms of Service apply.
      </i>
      <p className="text-xs md:text-sm">
        Copyright © 2026 & Dibuat dengan{" "}
        <i className="bx bxs-heart text-pink-700"></i> oleh{" "}
        <a
          className="hover:underline hover:text-secondary"
          href="https://qrion.id"
        >
          www.qrion.id
        </a>
      </p>
    </div>
  );
};

export default AdminFooter;
