<%@ page import="service.DatabaseDriver" %>
Welcome to the Unauthorized Page
<%--This page will be routed to if the user doesn't have the required permission for a page--%>
<% DatabaseDriver databaseDriver = new DatabaseDriver();%>