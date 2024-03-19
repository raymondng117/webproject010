
/*--
 * FUNCTION: Allowing a HIFIS instance to override content in footer links
 * NOTE(s):
 *  - displayed content is organized by Language; fr-CA (French), en-CA (English), Bi-lingual
 *  - each language will have its own condition below to manage/overwrite content
 *  - footer links a organized in HTML un-ordered lists (https://www.w3schools.com/html/html_lists_unordered.asp)
 *  - each list can be targetted using jquery child selectors (https://api.jquery.com/child-selector/)
 *  - current format of footer are 3 columns with nth list items, to append need to identify each list using the appropriate selector
 *      - first column selector     "#wb-info > div > nav > section:first"
 *      - middle column selector    "#wb-info > div > nav > nth-child(3)"
 *      - last column selector      "#wb-info > div > nav > section:last"
 *  - when the appropriate list is selected, 
 *      - either the footer title can be overwritten with $("#wb-info > div > nav > section:first > h6").text('????')
 *      - or a link can be appended to the list $("#wb-info > div > nav > section:first > ul").append('<li aria-label="footer link"><a href="#">Footer Link</a></li>');
 *      - Technical references:
 *          - https://api.jquery.com/child-selector/
 *          - https://www.w3schools.com/tags/tag_hn.asp
 *          - https://www.w3schools.com/tags/tag_a.asp
 *          - https://www.w3schools.com/html/html_lists_unordered.asp
 *          - https://www.w3schools.com/accessibility/accessibility_labels.php
 *   - SAMPLE CODE UNCOMMENT remove "//" from beginning of line to implement change 
 *      - Tecnhinal reference: https://www.w3schools.com/js/js_comments.asp
 * 
 * --*/

    /*-- Technical reference: https://api.jquery.com/ready/ --*/
    $(document).ready(function () {

        /*-- Technical reference: https://www.w3schools.com/jsref/met_document_getelementbyid.asp --*/
        if( typeof document.getElementById("CurrentCulture") !== 'undefined' && document.getElementById("CurrentCulture").value == "fr-CA" ){

            /*-- FRANCAIS --*/
            /*--footer--*/

            /*-- SAMPLE CODE remove "//" from each of line to implement change --*/
            /*-- BEGIN SAMPLE CODE for French --*/{


                //$("#wb-info > div > nav > section > ul").empty(); /*-- clears ALL existing list elements in footer, optionally, leave default links and "append" new links --*/

                //$("#wb-info > div > nav > section:first > h6").text('Première liste'); /*-- update text in header tag of first grouping of links --*/
                //$("#wb-info > div > nav > section:first > ul").append('<li aria-label="Lien de pied de page"><a href="#">Lien de pied de page</a></li>'); /*-- adding link to first grouping of links --*/

                //$("#wb-info > div > nav > section:nth-child(3) > h6").text('Deuxième liste'); /*-- update text in header tag in second grouping of links --*/
                //$("#wb-info > div > nav > section:nth-child(3) > ul").append('<li aria-label="Lien de pied de page2"><a href="#">Lien de pied de page2</a></li>'); /*-- adding link to second grouping of links --*/

                //$("#wb-info > div > nav > section:last > h6").text('Enquête liste'); /*-- update text in header tag in third grouping of links --*/
                //$("#wb-info > div > nav > section:last > ul").append('<li aria-label="Lien de pied de page3"><a href="#">Lien de pied de page3</a></li>'); /*-- adding link to third grouping of links --*/

            }/*-- END SAMPLE CODE for French --*/


        }else if( typeof document.getElementById("CurrentCulture") !== 'undefined' && document.getElementById("CurrentCulture").value == "en-CA" ){

            /*-- ENGLISH --*/
            /*--footer--*/

            /*-- SAMPLE CODE remove "//" from each of line to implement change --*/
            /*-- BEGIN SAMPLE CODE for English --*/{

                //$("#wb-info > div > nav > section > ul").empty(); /*-- clears ALL existing list elements in footer, optionally, leave default links and "append" new links --*/

                //$("#wb-info > div > nav > section:first > h6").text('First List'); /*-- update text in header tag of first grouping of links --*/
                //$("#wb-info > div > nav > section:first > ul").append('<li aria-label="Footer link"><a href="#">Footer link</a></li>'); /*-- adding link to first grouping of links --*/

                //$("#wb-info > div > nav > section:nth-child(3) > h6").text('Second List'); /*-- update text in header tag in second grouping of links --*/
                //$("#wb-info > div > nav > section:nth-child(3) > ul").append('<li aria-label="Footer link2"><a href="#">Footer link2</a></li>'); /*-- adding link to second grouping of links --*/

                //$("#wb-info > div > nav > section:last > h6").text('Final List'); /*-- update text in header tag in third grouping of links --*/
                //$("#wb-info > div > nav > section:last > ul").append('<li aria-label="Footer link3"><a href="#">Footer link3</a></li>'); /*-- adding link to third grouping of links --*/

            }/*-- END SAMPLE CODE for English --*/

        }else{

            /*-- BILINGUAL --/
        
            /*--footer--*/

            /*-- SAMPLE CODE remove "//" from each of line to implement change --*/
            /*-- BEGIN SAMPLE CODE for Bilingual --*/{

                //$("#wb-info > div > nav > section > ul").empty(); /*-- clears ALL existing list elements in footer, optionally, leave default links and "append" new links --*/

                //$("#wb-info > div > nav > section:first > h6").text('First List / Première liste'); /*-- update text in header tag of first grouping of links --*/
                //$("#wb-info > div > nav > section:first > ul").append('<li aria-label="Footer link / Lien de pied de page"><a href="#">Footer link / Lien de pied de page</a></li>'); /*-- adding link to first grouping of links --*/

                //$("#wb-info > div > nav > section:nth-child(3) > h6").text('Second List / Deuxième liste'); /*-- update text in header tag in second grouping of links --*/
                //$("#wb-info > div > nav > section:nth-child(3) > ul").append('<li aria-label="Footer link2 / Lien de pied de page2"><a href="#">Footer link2 / Lien de pied de page2</a></li>'); /*-- adding link to second grouping of links --*/

                //$("#wb-info > div > nav > section:last > h6").text('Final List / Enquête liste'); /*-- update text in header tag in third grouping of links --*/
                //$("#wb-info > div > nav > section:last > ul").append('<li aria-label="Footer link3 / Lien de pied de page3"><a href="#">Footer link3 / Lien de pied de page3</a></li>'); /*-- adding link to third grouping of links --*/

            }/*-- END SAMPLE CODE for Bilingual --*/

        }

});
