<%@ page import="service.DatabaseDriver" %>
Welcome to the Homepage
<%--This is the homepage of the application and doesn't require any permissions to access.  It has a button that redirects to the PermissionedPage.jsp--%>
<% DatabaseDriver databaseDriver = new DatabaseDriver();%>