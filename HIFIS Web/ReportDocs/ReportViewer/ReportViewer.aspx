<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportViewer.aspx.cs" Inherits="HIFIS.WEB.ReportDocs.ReportViewer" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=13.0.3500.0, Culture=neutral, PublicKeyToken=692fbea5521e1304"
    Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <style type="text/css">
        h1, h2, h3, h4, p { font-family: Arial,Verdana,Helvetica,sans-serif }
        
        h3 { color:GrayText }
        
        .ReportError { color: Maroon }

    </style>

    <title></title>
</head>
<body>    
    <form id="form1" runat="server">
    <div runat="server" id="ExportOptions" visible="false">

        <div runat="server" ID="ExportOptionsTitle" visible="false"></div>

        <asp:Button visible="false" Text="PDF" AlternateText="Download PDF Format" CssClass="btn btn-default  " ID="Button1" runat="server" onclick="PDF_Click" />
        <asp:Button visible="false" Text="EXCEL" AlternateText="Download Excel Format" CssClass="btn btn-default  " ID="Button2" runat="server" onclick="EXCEL_Click" />
        <asp:Button visible="false" Text="WORD" AlternateText="Download Word Format" CssClass="btn btn-default  " ID="Button3" runat="server" onclick="WORD_Click" />
        <CR:CrystalReportViewer ID="CrystalReportViewer" runat="server" AutoDataBind="true" />
    </div>    
    <div runat="server" id="Message"></div>    
    </form>
</body>
</html>
 