<%@ page import="service.DatabaseDriver" %>

<%--this handles the 2 Factor authentication with Authy and redirects to Homepage.jsp once the 2FA is completed--%>
<% DatabaseDriver databaseDriver = new DatabaseDriver();%>