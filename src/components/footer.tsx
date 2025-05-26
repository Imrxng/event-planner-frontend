import { memo } from "react";
import logo from "../assets/images/brightest_logo_black_yellow.webp";
import small from "../assets/images/brightest_logo_small.webp";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";

export default memo(function Footer() {
  return (
    <footer>
      <div className="topPart">
        <div className="footer_img">
          <a href="/" className="desk-foot-img" aria-label="Go to homepage">
            <img src={logo} alt="Brightest logo" className="footerLogo" />
          </a>
          <a href="/" className="res-foot-img">
            <img src={small} alt="" />
          </a>
        </div>
        <div className="footer__nav">
          <div className="firstThree">
            <a
              href="https://brightest.be/#whatWeDo"
              target="_blank"
              rel="noreferrer"
            >
              Solutions
            </a>
            <a
              href="https://brightest.be/cases/1"
              target="_blank"
              rel="noreferrer"
            >
              Cases
            </a>
            <a
              href="https://brightest.be/about"
              target="_blank"
              rel="noreferrer"
            >
              About
            </a>
          </div>
          <div className="secondThree">
            <a
              href="https://brightest.be/careers"
              target="_blank"
              rel="noreferrer"
            >
              Careers
            </a>
            <a
              href="https://brightest.be/downloads/1"
              target="_blank"
              rel="noreferrer"
            >
              Downloads
            </a>
            <a
              href="https://brightest.be/contact"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </a>
          </div>
          <div className="lastOne">
            <a
              href="https://academy.brightest.be/"
              target="_blank"
              rel="noreferrer"
            >
              <p>Academy</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="link_externalIcon__qD5gs"
              >
                <path d="M17.92,6.62a1,1,0,0,0-.54-.54A1,1,0,0,0,17,6H7A1,1,0,0,0,7,8h7.59l-8.3,8.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L16,9.41V17a1,1,0,0,0,2,0V7A1,1,0,0,0,17.92,6.62Z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer__socials">
          <a
            className="footer-round"
            href="https://www.linkedin.com/company/brightest-nv/"
            target="_blank"
            aria-label="Visit Brightest on LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            className="footer-round"
            href="https://www.facebook.com/BrightestNV/"
            target="_blank"
            aria-label="Visit Brightest on Facebook"
          >
            <FaFacebook />
          </a>
          <a
            className="footer-round"
            href="https://www.instagram.com/brightestsoftwarequality/"
            target="_blank"
            aria-label="Visit Brightest on Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
      <div className="bottomPart">
        <div className="bottomPart__links">
          <a
            href="https://brightest.be/terms-and-conditions"
            target="_blank"
            rel="noreferrer"
          >
            General Terms and Conditions
          </a>
          <a
            href="https://brightest.be/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy and Cookie Policy
          </a>
          <a
            href="https://brightest.be/e-wallet"
            target="_blank"
            rel="noreferrer"
          >
            Kmo-portefeuille
          </a>
        </div>
        <p>&#169; 2024 Brightest NV - BTW 0538.477.187</p>
      </div>
    </footer>
  );
});
