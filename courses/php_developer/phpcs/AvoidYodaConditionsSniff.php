<?php
/**
 * Avoid Yoda conditions.
 */

/**
 * This sniff checks using "Youda conditions" in code
 *
 * An example of a stuff
 *
 * <code>
 *   // Good code
 *   if ($hello === 'world') {
 *       echo "Hello, world!";
 *   }
 *
 *   // Bad code
 *   if ('hello' === $world) {
 *       echo "Yoda, get out of here!";
 *   }
 * </code>
 */
class Axioma_Sniffs_Operators_AvoidYodaConditionsSniff implements PHP_CodeSniffer_Sniff
{
    /**
     * Returns the token types that this sniff is interested in.
     *
     * @return array(int)
     */
    public function register()
    {
        return array(T_IS_EQUAL, T_IS_NOT_EQUAL, T_IS_IDENTICAL, T_IS_NOT_IDENTICAL, T_LESS_THAN, T_GREATER_THAN, T_IS_GREATER_OR_EQUAL, T_IS_SMALLER_OR_EQUAL);
    }//end register()

    /**
     * Processes the tokens that this sniff is interested in.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file where the token was found.
     * @param int                  $stackPtr  The position in the stack where
     *                                        the token was found.
     *
     * @return void
     */
    public function process(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        $tokens = $phpcsFile->getTokens();
        $seek = true;
        $currentPtr = $stackPtr;

        while ($seek) {
            $current = $tokens[$currentPtr - 1];
            switch ($current['code']) {
                case T_WHITESPACE:
                    $currentPtr--;
                    break;
                case T_CONSTANT_ENCAPSED_STRING:
                case T_LNUMBER:
                case T_TRUE:
                case T_FALSE:
                case T_DNUMBER:
                    $data = [];
                    for ($i = $currentPtr - 1; $i <= $stackPtr; $i++) {
                        $data[] = $tokens[$i]['content'];
                    }
                    $data[] = ' <expression>';

                    $error = 'Need Avoid Yoda conditions; found %s';
                    $phpcsFile->addError($error, $stackPtr, 'Found', join('', $data));
                    $seek = false;
                    break;
                default:
                    $seek = false;
                    break;
            }
        }
    }//end process()
}//end class
