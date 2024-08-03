import React,{useEffect} from 'react'
import './footer.css'
import video2 from './../../../../assets/video/video2.mp4'
import { FaHotel } from "react-icons/fa6";
import { FiFacebook, FiInstagram, FiTwitter,FiYoutube,FiChevronRight ,FiSend  } from "react-icons/fi";
import Aos from 'aos'
import 'aos/dist/aos.css'

const Footer = () => {

  useEffect(() =>{
    Aos.init({duration: 2000})
  },[])

  return (
    <section className='footer'>
      <div className="videoDiv">
        <video src={video2} loop autoPlay muted type="video/mp4"></video>
      </div>

      <div className="secContent container">
        <div className="contactDiv flex">
          <div className="text" data-aos="fade-up">
            <small>Liên lạc</small>
            <h2>Đặt khách sạn hãy liên hệ chúng tôi</h2>
          </div>

          <div className="inputDiv flex">
            <input type="text" placeholder='Nhập Email' data-aos="fade-up"/>
            <button type='submit' className="btn flex" data-aos="fade-up">
              Gửi <FiSend className='icon'/>
            </button>
          </div>
        </div>

        <div className="footerCard flex">
          <div className="footerIntro flex">
            <div className="logoDiv">
              <a href="" className="logo flex">
                <FaHotel className="icon" />Hubert Hotel
              </a>
            </div>

            <div className="footerParagraph" data-aos="fade-up">
            Hãy để chúng tôi chăm sóc bạn từ những giây phút đầu tiên bạn đặt chân đến khách sạn cho đến khi kết thúc kỳ nghỉ. Đặt phòng ngay hôm nay để tận hưởng những ưu đãi đặc biệt và khám phá những điều thú vị đang chờ đón bạn tại hệ thống đặt phòng khách sạn Huber Hotel.
            </div>

            <div className="footerSocials flex" data-aos="fade-up">
              <FiFacebook className='icon'/>
              <FiInstagram className='icon'/>
              <FiTwitter className='icon'/>
              <FiYoutube className='icon'/>
            </div>
          </div>

          <div className="footerLinks grid">

            {/* group 1 */}
            <div className="linkGroup" data-aos="fade-up" data-aos-duration="3000">
              <span className="groupTitle">
                Đại lý chúng tôi
              </span>

              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Bảo hiểm
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Hãng
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Du lịch
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Thanh toán
              </li>
            </div>

             {/* group 2 */}
             <div className="linkGroup" data-aos="fade-up" data-aos-duration="4000">
              <span className="groupTitle">
                Đối tác
              </span>

              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Bảo hiểm
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Hãng
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Du lịch
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Thanh toán
              </li>
            </div>

             {/* group 3 */}
             <div className="linkGroup" data-aos="fade-up" data-aos-duration="5000">
              <span className="groupTitle">
                Đại lý chúng tôi
              </span>

              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Bảo hiểm
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Hãng
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Du lịch
              </li>
              <li className="footerList flex">
                <FiChevronRight className='icon'/>
                Thanh toán
              </li>
            </div>
          </div>

          <div className="footerDiv flex">
            <small>Best hotel website theme</small>
            <small>Copyrights reserved - Isratech</small>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer