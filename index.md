# Japanese Grammar Notes

These are my personal notes from studying for the grammar portion of the the JLPT test.
I don't make any claims as to their accuracy or usefulness for others.

The main goal is to be brief to allow easy review, not to be comprehensive.
For comprehensive coverage, refer to the list of references below.

The sentences that follow some grammar points are not examples from a book.
They are sentences that I wrote myself to practice using the grammar.
Since I am not a native speaker, they probably contain many errors.

If you do notice errors, I appreciate corrections.

[JLPT N3 Grammar Notes](?n3)

[JLPT N2 Grammar Notes](?n2)

[Kanji in Context AI Generated Stories](?kanji-in-context-stories)

# References

The notes mostly follow the order of presentation in Shin Kanzen Master.  I use
the other books to double-check my understanding.

## Shin Kanzen Master

[Shin Kanzen Master N3 Grammar](https://www.amazon.com/Grammar-Japanese-Language-Proficiency-Complete/dp/4883196100)

[Shin Kanzen Master N2 Grammar](https://www.amazon.com/Grammar-Japanese-Language-Proficiency-Nihongo/dp/4883195651)

## Nihongo So Matome

[Nihongo So Matome N3 Grammar](https://www.amazon.com/Nihongo-So-matome-Japanese-Language-Proficiency/dp/4872177320)

[Nihongo So Matome N2 Grammar](https://www.amazon.com/Nihongo-So-matome-Essential-Practice-Proficiency/dp/4872177290)

## A Dictionary of Japanese Grammar

[A Dictionary of Basic Japanese Grammar](https://www.amazon.com/Dictionary-Basic-Japanese-Grammar/dp/4789004546)

[A Dictionary of Intermediate Japanese Grammar](https://www.amazon.com/Dictionary-Intermediate-Japanese-Grammar/dp/4789007758)

[A Dictionary of Advanced Japanese Grammar](https://www.amazon.com/Dictionary-Advanced-Japanese-Grammar-English/dp/4789012956)

## Kanji

[Kanji in Context](https://www.amazon.com/Kanji-Context-Reference-Book-Rivesed/dp/4789015297)

# Markdown Extensions

The notes are mostly written in Markdown format, but there are a few additions
to make it easier to write Japanese notes.

This section will not look correct on Github since it does not support these
extensions.

## Furigana

Writing ruby tags is painful, so I added a simlple syntax for furigana.

### Single Kanji
    {本|ほん}

{本|ほん}

### Multiple Kanji with Shared Reading

    {今日|きょう}

{今日|きょう}

### Reading per character
If multiple characters are included on the left side, then the kana on the right
side can be separated by commas.  If the number of comma-separated groups is equal
to the number of kanji on the left, then each group will be associated with the
correct kanji when ruby tags are created.

    {日本語|に,ほん,ご}

{日本語|に,ほん,ご}

### Long readings

Normally only 2 kana can fit over a single kanji in HTML.  Adding more will cause
spaces to form between characters.  I added a second font with kana compressed to
66% of their original width so that 3 kana can fit over a single kanji.
The compressed or uncompressed font will automatically be selected, so furigana
will only be compressed if necessary.

    {私|わたし}の{妹|いもうと}は{雷|かみなり}が{苦手|にが,て}です。

{私|わたし}の{妹|いもうと}は{雷|かみなり}が{苦手|にが,て}です。

## Substitutions

Certain common characters and icons can be created by writing a word inside
curly braces:

    {wave}

{wave}

    {dots}

{dots}

    {noun}

{noun}

    {verb}

{verb}

    {i-adj}

{i-adj}

    {na-adj}

{na-adj}

## Multi-line tables

Most versions of markdown tables don't easily support multiple lines inside a cell.
Since I needed to do that a lot, I made a special syntax for it.

### Grammar Tables

These tables have internal vertical border lines and no headers.  Usually they
are only one row.

    [[[
    {noun}の                   | うちに
    {verb}辞書形/ている形/ない形 |
    {i-adj}い                  |
    {na-adj}な                 |
    ]]]

[[[
{noun}の                   | うちに
{verb}辞書形/ている形/ない形 |
{i-adj}い                  |
{na-adj}な                 |
]]]

### Tables with Borders

These tables have all border lines and the first row is a header.

    :::
    Humble | Regular | Honorific
    -	
    {参|まい}る | {行|い}く | いらっしゃる
                |           | おいでになる
    -
    {参|まい}る | {来|く}る | いらっしゃる
                |           | おいでになる
                |           | {見|み}える
    :::

:::
Humble | Regular | Honorific
-	
{参|まい}る | {行|い}く | いらっしゃる
            |           | おいでになる
-
{参|まい}る | {来|く}る | いらっしゃる
            |           | おいでになる
            |           | {見|み}える
:::

## Custom HTML tag

Sometimes I needed to add a square around characters, so I added this tag:

    <sq>漢字</sq>

<sq>漢字</sq>