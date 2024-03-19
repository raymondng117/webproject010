To update from github WET project:

* Update the contents of "~/Content/WET" directory with contents of "build" directory in updated WET
* View diff and transfer any changes over to our existing template


What I've done:
* Replace contents of "~/Content/WET" directory with contents of "build" directory in updated WET.
* Replace "_Layout.cshtml" with "demos\theme-gcwu-fegc\application-secnav2-eng.html"
* In "_Layout.cshtml", replace /\~/Content/WET/[^"]*/ with /@Url.Content("\0")/
* In "_Layout.cshtml", replace "Application Template - Secondary menu 2 - GC Web Usability theme" with "@Html.Partial("LayoutParts/_ViewTitle")"
* In "_Layout.cshtml", replace everything else inside the "<!-- MainContentStart -->" & "<!-- MainContentEnd -->" with "@RenderBody()"
* In "_Layout.cshtml", replace "<a href="section2/index-eng.html">Section 2</a>" with "@Html.Partial("LayoutParts/_LogOut")"
* "Application Template - Secondary menu 2 - GC Web Usability theme - Working examples - Web Experience Toolkit (WET)" with "@Html.Partial("LayoutParts/_Title")"
* Add "@Html.Partial("LayoutParts/_CustomScriptsCSS")" anywhere right below the <!-- CustomScriptsCSSStart --> heading at the bottom of the <header> tag.
* Replace contents of <!-- SecNavStart --> with "@Html.Partial("LayoutParts/_SecNav")"
* Replace contents of <!-- HeaderStart --> with "@Html.Partial("LayoutParts/_Header")"
* and probably a few other things. :(