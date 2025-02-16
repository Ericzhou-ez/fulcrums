import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CaretDown, CaretRight, Question } from "phosphor-react"; // 引入图标

const faqs = [
   {
      id: "FAQ-1",
      question: "该系统提供哪些功能？",
      answer:
         "BM-Assist为采购团队提供了一站式解决方案，大幅节省整理和生成报价单所需的时间。通过本系统，用户可以在与供应商沟通时实时录入产品信息。系统支持一键导出：<strong>内部副本、客户报价单、财务报告以及海关报关单</strong>。所有生成的文档均为标准格式，确保易于使用和提交。",
   },
   {
      id: "FAQ-2",
      question: "如何注册并开始使用该系统？",
      answer:
         "注册和登录过程非常简单，无需填写公司名称或繁琐的表单。用户只需使用 <strong>Google 账号登录</strong>，即可立即访问系统的所有功能。系统采用 <strong>Firebase</strong> 存储所有用户数据，确保快速访问和高可靠性。完成登录后，您可以按照以下步骤操作：<br>" +
         "<br> &emsp;1. <strong>录入产品信息</strong>：在与供应商会面时，将产品的关键数据（如名称、价格、规格）实时录入系统。<br>" +
         "&emsp;2. <strong>生成文档</strong>：完成产品信息录入后，点击导出按钮，选择生成的文档类型（客户报价单、内部副本、财务报告或报关单）。<br>" +
         "&emsp;3. <strong>一键下载</strong>：文档将在几秒内自动生成，您可以立即下载并分享给相关人员。",
   },
   {
      id: "FAQ-3",
      question: "该系统的数据是否安全？如何保障隐私？",
      answer:
         "是的，数据安全和隐私保护是我们的首要任务。我们采用 <strong>Firebase</strong> 进行数据存储，并遵循最新的数据安全和隐私保护法规。所有数据传输均经过加密处理，用户数据仅授权用户可访问。<strong>Google 登录机制</strong> 还提供了额外的安全保障，防止未经授权的访问。",
   },
];



export function Faqs() {
   return (
      <Box
         sx={{ bgcolor: "var(--mui-palette-background-level1)", py: "80px" }}
      >
         <Container maxWidth="md">
            <Stack spacing={4}>
               <Stack maxWidth="700px" sx={{ mx: "auto" }}>
                  <Stack spacing={2}>
                     <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Chip
                           icon={<Question size={16} color="#f0402e" />}
                           label="FAQ"
                           sx={{
                              padding: "10px 5px",
                              borderRadius: "20px",
                              color: "#f0402e",
                              backgroundColor: "#f7bc94",
                           }}
                        />
                     </Box>
                     <Typography
                        sx={{ textAlign: "center", fontWeight: "500" }}
                        variant="h3"
                     >
                        常见问题
                     </Typography>
                     <Typography color="text.secondary">
                        如果您有其他问题，请通过
                        <a href="mailto:zhoueric882@gmail.com">
                           <span className="email-mailto">电子邮件</span>
                        </a>
                        联系我们。
                     </Typography>
                  </Stack>
               </Stack>
               <Stack spacing={2}>
                  {faqs.map((faq) => (
                     <Faq key={faq.id} {...faq} />
                  ))}
               </Stack>
            </Stack>
         </Container>
      </Box>
   );
}

interface FaqProps {
   answer: string;
   question: string;
}

function Faq({ answer, question }: FaqProps) {
   const [isExpanded, setIsExpanded] = React.useState(false);

   return (
      <Card
         sx={{
            p: 3,
            transition: "all 0.2s ease",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
         }}
      >
         <Stack
            onClick={() => setIsExpanded((prevState) => !prevState)}
            sx={{ cursor: "pointer" }}
         >
            <Stack
               direction="row"
               spacing={2}
               sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
               <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "500", fontSize: "1.1rem" }}
               >
                  {question}
               </Typography>
               {isExpanded ? <CaretDown size={24} /> : <CaretRight size={24} />}
            </Stack>
            <Collapse in={isExpanded}>
               <Typography
                  color="text.secondary"
                  sx={{ pt: 3 }}
                  variant="body2"
                  dangerouslySetInnerHTML={{ __html: answer }} 
               />
            </Collapse>
         </Stack>
      </Card>
   );
}

