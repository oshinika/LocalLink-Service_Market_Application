function Footer() {
  return (
    <footer
      className="text-white text-center py-2 shadow-inner mt-auto"
      style={{ backgroundColor: "#006400" }}
    >
      © {new Date().getFullYear()} LocalLink. All rights reserved.
    </footer>
  );
}

export default Footer;
