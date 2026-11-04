// A hello for anyone who opens DevTools to see how this was built
export function consoleHello() {
  const title = "font: 700 22px Georgia, serif; color: #a8401d;";
  const body = "font: 13px/1.6 ui-monospace, monospace; color: inherit;";
  console.log(
    "%c✦ Hey, fellow builder!%c\n\n" +
      "Peeking under the hood? Same. The source is open:\n" +
      "https://github.com/starlightknown/starlightknown.github.io\n\n" +
      "Good first issues welcome, typo fixes celebrated.\n" +
      "Psst: click the page and type \"night\".\n\n" +
      "— Karuna",
    title,
    body,
  );
}
