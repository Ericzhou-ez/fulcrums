import { Box, Typography, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../../styles/contact.css";
import LinkedInIcon from "../../assets/icons/linkedinIcon.svg";
import InstagramIcon from "../../assets/icons/instagramIcon.svg";
import EmailIcon from "../../assets/icons/mailboxIcon.svg";
import { useState } from "react";
import { CaretDown, CaretUp } from "phosphor-react";

export default function ContactMain() {
   const theme = useTheme();
   const borderColor =
      theme.palette.mode === "dark"
         ? "rgba(255, 255, 255, 0.2)"
         : "rgba(0, 0, 0, 0.2)";
   const textColor =
      theme.palette.mode === "dark"
         ? "rgba(255, 255, 255, 0.7)"
         : "rgba(0, 0, 0, 0.7)";

   return (
      <Box
         sx={{
            paddingTop: "120px",
            width: { xs: "90%", md: "80%" },
            maxWidth: "1400px",
            margin: "0 auto",
         }}
      >
         <div
            className="dot-mask-container"
            style={{
               border: `0.5px solid ${borderColor}`,
               position: "relative",
               borderTopRightRadius: "20px",
               borderBottomLeftRadius: "20px",
            }}
         >
            <div
               style={{
                  position: "absolute",
                  width: "15px",
                  height: "15px",
                  borderColor: borderColor,
                  top: "-15px",
                  left: "-15px",
                  borderLeft: `0.5px solid ${borderColor}`,
                  borderTop: `0.5px solid ${borderColor}`,
                  transform: "rotate(180deg)",
               }}
            ></div>
            <div
               style={{
                  position: "absolute",
                  width: "15px",
                  height: "15px",
                  borderColor: borderColor,
                  bottom: "-15px",
                  right: "-15px",
                  borderRight: `0.5px solid ${borderColor}`,
                  borderBottom: `0.5px solid ${borderColor}`,
                  transform: "rotate(180deg)",
               }}
            ></div>

            <Box alignContent="center" className="dot-mask">
               <Typography
                  className="contact-bubble"
                  variant="h1"
                  sx={{
                     fontSize: {
                        xs: "2.8rem",
                        sm: "4rem",
                        md: "5rem",
                        lg: "6rem",
                     },
                     fontWeight: 600,
                     pt: { xs: "30px", md: "50px" },
                     pb: { xs: "30px", md: "50px" },
                  }}
               >
                  联系我们.
               </Typography>
            </Box>
         </div>

         <Box mt={2.5}>
            <Grid container justifyContent="center" alignItems="stretch">
               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px 40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                     }}
                  >
                     <img
                        src={LinkedInIcon}
                        alt="LinkedIn"
                        className="contact-icon"
                        style={{
                           width: "35px",
                           filter:
                              theme.palette.mode === "dark"
                                 ? "invert(100%)"
                                 : "none",
                        }}
                     />
                     <Typography
                        variant="body1"
                        sx={{
                           fontWeight: 500,
                           color: "text.primary",
                           display: "inline",
                           fontSize: "1.2rem",
                        }}
                     >
                        与我建立联系
                        <Typography
                           variant="body1"
                           sx={{
                              color: textColor,
                              fontWeight: 500,
                              display: "inline",
                              fontSize: "1.2rem",
                           }}
                        >
                           在LinkedIn上与我交流想法并探索更多机会。
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "20px",
                           fontSize: "0.9rem",
                           textTransform: "none",
                           padding: "5px 20px",
                           borderRadius: "30px",
                           border: `0.5px solid ${borderColor}`,
                        }}
                        onClick={() =>
                           window.open(
                              "https://www.linkedin.com/in/eric-zhou-ez/",
                              "_blank"
                           )
                        }
                     >
                        联系
                     </Button>
                  </Box>
               </Grid>

               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px 40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                     }}
                  >
                     <img
                        src={InstagramIcon}
                        alt="Instagram"
                        className="contact-icon"
                        style={{
                           width: "40px",
                           filter:
                              theme.palette.mode === "dark"
                                 ? "invert(100%)"
                                 : "none",
                        }}
                     />
                     <Typography
                        variant="body1"
                        sx={{
                           fontWeight: 500,
                           color: "text.primary",
                           display: "inline",
                           fontSize: "1.2rem",
                        }}
                     >
                        关注我的Instagram动态
                        <Typography
                           variant="body1"
                           sx={{
                              color: textColor,
                              fontWeight: 500,
                              display: "inline",
                              fontSize: "1.2rem",
                           }}
                        >
                           来获取最新动态和幕后故事。
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "20px",
                           fontSize: "0.9rem",
                           textTransform: "none",
                           padding: "5px 20px",
                           borderRadius: "30px",
                           border: `0.5px solid ${borderColor}`,
                        }}
                        onClick={() =>
                           window.open(
                              "https://www.instagram.com/eric_zh0u/",
                              "_blank"
                           )
                        }
                     >
                        关注 @eric_zh0u
                     </Button>
                  </Box>
               </Grid>

               <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                  <Box
                     className="contact-box"
                     sx={{
                        flex: 1,
                        border: `0.5px solid ${borderColor}`,
                        padding: "30px 40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                     }}
                  >
                     <img
                        src={EmailIcon}
                        alt="Email"
                        className="contact-icon"
                        style={{
                           width: "40px",
                           filter:
                              theme.palette.mode === "dark"
                                 ? "invert(100%)"
                                 : "none",
                        }}
                     />
                     <Typography
                        variant="body1"
                        sx={{
                           fontWeight: 500,
                           color: "text.primary",
                           display: "inline",
                           fontSize: "1.2rem",
                        }}
                     >
                        让我们一起创造更多可能;{" "}
                        <Typography
                           variant="body1"
                           sx={{
                              color: textColor,
                              fontWeight: 500,
                              display: "inline",
                              fontSize: "1.2rem",
                           }}
                        >
                           通过电子邮件联系我，咨询Fulcrums相关事宜。
                        </Typography>
                     </Typography>
                     <Button
                        variant="text"
                        sx={{
                           color: textColor,
                           marginTop: "20px",
                           fontSize: "0.9rem",
                           textTransform: "none",
                           padding: "5px 20px",
                           borderRadius: "30px",
                           border: `0.5px solid ${borderColor}`,
                        }}
                        onClick={() =>
                           window.open("mailto:zhoueric882@gmail.com", "_blank")
                        }
                     >
                        联系我
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </Box>

         <FAQSection borderColor={borderColor} />

         <Grid
            container
            spacing={12}
            mt={2.5}
            sx={{
               width: "100%",
               maxWidth: "1400px",
               mx: "auto",
               position: "relative",
            }}
         >
            <div
               style={{
                  position: "absolute",
                  width: "15px",
                  height: "15px",
                  borderColor: borderColor,
                  top: "-15px",
                  right: "-15px",
                  borderLeft: `0.5px solid ${borderColor}`,
                  borderTop: `0.5px solid ${borderColor}`,
                  transform: "rotate(270deg)",
               }}
            ></div>
            <div
               style={{
                  position: "absolute",
                  width: "15px",
                  height: "15px",
                  borderColor: borderColor,
                  bottom: "-15px",
                  left: "-15px",
                  borderRight: `0.5px solid ${borderColor}`,
                  borderBottom: `0.5px solid ${borderColor}`,
                  transform: "rotate(270deg)",
               }}
            ></div>
            <Grid
               item
               xs={12}
               lg={8}
               sx={{
                  border: `0.5px solid ${borderColor}`,
                  borderTopLeftRadius: "20px",
                  padding: "30px 40px !important",
               }}
            >
               <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap={4}
               >
                  <Typography
                     sx={{
                        fontWeight: "600",
                        fontSize: "1.4rem",
                        width: { xs: "100%", md: "80%" },
                     }}
                     color="GrayText"
                  >
                     <Typography
                        color="text.primary"
                        sx={{
                           fontWeight: "600",
                           fontSize: "1.4rem",
                           display: "inline",
                        }}
                     >
                        不确定该选择哪个方案?{" "}
                     </Typography>
                     欢迎与我们讨论
                     <span style={{ color: "#0071e3" }}>免费版</span>或
                     <span style={{ color: "#ff7c00" }}>企业版</span>
                     的需求，了解定制定价方案，或者申请产品演示。
                  </Typography>

                  <a href="mailto:zhoueric882@gmail.com">
                     <Button
                        variant="contained"
                        color="info"
                        sx={{
                           width: "fit-content",
                        }}
                     >
                        预约演示
                     </Button>
                  </a>
               </Box>
            </Grid>
            <Grid
               item
               xs={12}
               lg={4}
               sx={{
                  padding: "30px 40px !important",
                  border: `0.5px solid ${borderColor}`,
                  borderBottomRightRadius: "20px",
               }}
            >
               <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap={3}
               >
                  <Typography
                     sx={{
                        fontWeight: "600",
                        fontSize: "1.4rem",
                        width: { xs: "100%", md: "80%" },
                     }}
                     color="text.primary"
                  >
                     <Typography
                        color="GrayText"
                        sx={{
                           fontWeight: "600",
                           fontSize: "1.4rem",
                           display: "inline",
                        }}
                     >
                        通过互动产品导览，试用或个性化演示，
                     </Typography>
                     探索Fulcrums企业版.
                  </Typography>

                  <a href="mailto:zhoueric882@gmail.com">
                     <Button
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{
                           width: "fit-content",
                        }}
                     >
                        了解企业版
                     </Button>
                  </a>
               </Box>
            </Grid>
         </Grid>
      </Box>
   );
}
const faqData = [
   {
      question: "该系统提供哪些功能？",
      answer:
         "Fulcrums 为采购团队提供了一站式解决方案，大幅节省整理和生成报价单所需的时间。通过本系统，用户可以在与供应商沟通时实时录入产品信息。系统支持一键导出：内部副本、客户报价单、财务报告以及海关报关单。所有生成的文档均为标准格式，确保易于使用和提交。",
   },
   {
      question: "如何注册并开始使用该系统？",
      // The outer Typography is set to component="div" to avoid nesting <p> tags.
      answer: (
         <>
            <Typography variant="body2" component="div" gutterBottom>
               注册和登录过程非常简单，无需填写公司名称或繁琐的表单。用户只需使用
               Google 账号登录，即可立即访问系统的所有功能。系统采用 Firebase
               存储所有用户数据，确保快速访问和高可靠性。完成登录后，您可以按照以下步骤操作：
            </Typography>

            {/* For lists, a <li> often wraps <p>, so it’s best to ensure 
            the inner Typography uses a "span" or "div" component if needed. */}
            <Box component="ol" sx={{ pl: 3, m: 0 }}>
               <li>
                  <Typography variant="body2" component="span">
                     录入产品信息：在与供应商会面时，将产品的关键数据（如名称、价格、规格）
                     实时录入系统。
                  </Typography>
               </li>
               <li>
                  <Typography variant="body2" component="span">
                     生成文档：完成产品信息录入后，点击导出按钮，
                     选择生成的文档类型（客户报价单、内部副本、财务报告或报关单）。
                  </Typography>
               </li>
               <li>
                  <Typography variant="body2" component="span">
                     一键下载：文档将在几秒内自动生成，您可以立即下载并分享给相关人员。
                  </Typography>
               </li>
            </Box>
         </>
      ),
   },
   {
      question: "Fulcrums的数据是否安全？如何保障隐私？",
      answer:
         "是的，数据安全和隐私保护是我们的首要任务。我们采用 Firebase 进行数据存储，并遵循最新的数据安全和隐私保护法规。所有数据传输均经过加密处理，用户数据仅授权用户可访问。Google 登录机制还提供了额外的安全保障，防止未经授权的访问。",
   },
   {
      question: "是否支持移动设备访问？",
      answer:
         "是的，系统具备自适应界面，无论您使用手机、平板还是桌面设备，都能获得流畅的操作体验。所有功能均已针对移动端优化，确保您随时随地高效工作。",
   },
   {
      question: "如何获得技术支持或提交反馈？",
      answer:
         "在系统主菜单中，您可以找到“帮助与支持”选项，点击后可提交工单或直接填写反馈表。我们的技术支持团队会在24小时内回复，帮助您快速解决任何问题。",
   },
   {
      question: "Fulcrums是否需要额外培训？",
      answer:
         "Fulcrums的设计注重直观和易用性，因此大多数用户无需额外培训即可上手。我们也提供了详细的操作文档和短视频教程，帮助新手快速熟悉流程。",
   },
   {
      question: "在与外部合作伙伴分享文档时需要注意什么？",
      answer:
         "在导出客户报价单或财务报告前，请先确认文档的敏感信息是否已妥善处理，如特定折扣或内部备注等。系统支持快速隐藏敏感字段，避免在与外部合作伙伴共享时暴露不必要的内部数据。",
   },
];

const FAQSection = ({ borderColor = "#ccc" }) => {
   const [openFAQ, setOpenFAQ] = useState<Record<number, boolean>>({});

   const toggleFAQ = (index: number) => {
      setOpenFAQ((prev) => ({ ...prev, [index]: !prev[index] }));
   };

   return (
      <Box sx={{ width: "100%", maxWidth: "1400px", mt: 3 }}>
         <Grid container spacing={0}>
            <Grid
               item
               xs={12}
               md={4}
               sx={{
                  top: { md: 0 },
                  border: `0.5px solid ${borderColor}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 0,
                  m: 0,
               }}
            >
               <Typography
                  variant="h4"
                  sx={{
                     fontSize: { xs: "2rem", md: "2.42rem" },
                     m: 0,
                     fontWeight: 600,
                     padding: "30px 0",
                     position: { xs: "static", md: "sticky" },
                     top: 0,
                  }}
               >
                  常见问题
               </Typography>
            </Grid>

            <Grid
               item
               xs={12}
               md={8}
               p={4}
               sx={{ border: `0.5px solid ${borderColor}` }}
            >
               {faqData.map((faq, index) => {
                  const isOpen = openFAQ[index];
                  return (
                     <Box
                        key={index}
                        sx={{
                           borderBottom: `0.5px solid ${borderColor}`,
                           pb: 2,
                           mb: 2,
                           cursor: "pointer",
                        }}
                        onClick={() => toggleFAQ(index)}
                     >
                        <Box
                           display="flex"
                           alignItems="center"
                           justifyContent="space-between"
                        >
                           <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                 mr: 1,
                                 fontWeight: 500,
                                 fontSize: "1.08rem",
                              }}
                           >
                              {faq.question}
                           </Typography>
                           {isOpen ? (
                              <CaretUp size={20} />
                           ) : (
                              <CaretDown size={20} />
                           )}
                        </Box>

                        {isOpen && (
                           <Box sx={{ mt: 1 }}>
                              {typeof faq.answer === "string" ? (
                                 <Typography variant="body2" component="div">
                                    {faq.answer}
                                 </Typography>
                              ) : (
                                 faq.answer
                              )}
                           </Box>
                        )}
                     </Box>
                  );
               })}
            </Grid>
         </Grid>
      </Box>
   );
};
