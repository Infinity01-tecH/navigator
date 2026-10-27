import { useEffect, useRef } from 'react';

const NS = 'http://www.w3.org/2000/svg';

interface Icon { n: string; d: string; }

const ICONS: Icon[] = [
  { n: 'google', d: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' },
  { n: 'gemini', d: 'M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81' },
  { n: 'youtube', d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { n: 'javascript', d: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z' },
  { n: 'figma', d: 'M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z' },
  { n: 'react', d: 'M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z' },
  { n: 'git', d: 'M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187' },
  { n: 'vscode', d: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z' },
  { n: 'github', d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
  { n: 'notion', d: 'M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z' },
  { n: 'telegram', d: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' },
  { n: 'dribbble', d: 'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z' },
  { n: 'claude', d: 'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z' },
  { n: 'lovable', d: 'M12 21.500C6.500 17.500 3 14 3 9.800A4.800 4.800 0 0 1 12 7.600a4.800 4.800 0 0 1 9 2.200c0 4.200-3.500 7.700-9 11.700z' },
];

const PRELOADER_CSS = `
  .npl-root {
    --npl-bg: var(--background, #ffffff);
    --npl-fg: var(--foreground, #131927);
    --npl-accent: #8cb200;
    --npl-on-accent: #ffffff;
    --npl-border: #d9dccd;
    --npl-fill: #f3f5ea;
  }
  .dark .npl-root {
    --npl-bg: var(--background, #000000);
    --npl-fg: var(--foreground, #F1EEE6);
    --npl-accent: #C8F135;
    --npl-on-accent: #000000;
    --npl-border: #3d3d39;
    --npl-fill: #141413;
  }
  .npl-root {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--npl-bg);
    color: var(--npl-fg);
    font-family: ui-sans-serif, system-ui, sans-serif;
  }
  .npl-preloader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 16px;
    width: 100%;
    height: 100%;
  }
  .npl-stage {
    position: relative;
    width: 100%;
    max-width: 320px;
    height: 214px;
  }
  .npl-grid {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: opacity 500ms ease;
  }
  .npl-row {
    display: flex;
    flex: 1;
    gap: 12px;
    min-height: 0;
  }
  .npl-box {
    min-width: 0;
    border: 1.5px solid var(--npl-border);
    border-radius: 14px;
  }
  .npl-grid .npl-box {
    flex: 1 1 0;
    transition: flex-grow 900ms cubic-bezier(0.65, 0, 0.35, 1);
  }
  .npl-stage.is-zoom .npl-grid { opacity: 0; }

  .npl-panel {
    position: absolute;
    left: var(--npl-x);
    top: var(--npl-y);
    width: calc(50% - 6px);
    height: calc(50% - 6px);
    background: var(--npl-bg);
    opacity: 0;
    pointer-events: none;
    overflow: hidden;
    transition:
      left 900ms cubic-bezier(0.65, 0, 0.35, 1),
      top 900ms cubic-bezier(0.65, 0, 0.35, 1),
      width 900ms cubic-bezier(0.65, 0, 0.35, 1),
      height 900ms cubic-bezier(0.65, 0, 0.35, 1),
      opacity 400ms ease;
  }
  .npl-panel.tl { --npl-x: 0px; --npl-y: 0px; }
  .npl-panel.tr { --npl-x: calc(50% + 6px); --npl-y: 0px; }
  .npl-panel.bl { --npl-x: 0px; --npl-y: calc(50% + 6px); }
  .npl-panel.br { --npl-x: calc(50% + 6px); --npl-y: calc(50% + 6px); }

  .npl-stage[data-zoom="tl"] .npl-panel.tl,
  .npl-stage[data-zoom="tr"] .npl-panel.tr,
  .npl-stage[data-zoom="bl"] .npl-panel.bl,
  .npl-stage[data-zoom="br"] .npl-panel.br {
    left: 0; top: 0; width: 100%; height: 100%; opacity: 1;
  }

  .npl-inner {
    position: absolute;
    left: 0; top: 0;
    width: 320px; height: 214px;
    opacity: 0;
    transition: opacity 250ms ease;
  }
  .npl-stage[data-show="tl"] .npl-panel.tl .npl-inner,
  .npl-stage[data-show="tr"] .npl-panel.tr .npl-inner,
  .npl-stage[data-show="bl"] .npl-panel.bl .npl-inner,
  .npl-stage[data-show="br"] .npl-panel.br .npl-inner { opacity: 1; }

  /* TL — build list */
  .npl-build-window {
    position: absolute;
    top: 20px; right: 26px; bottom: 72px; left: 26px;
    overflow: hidden;
  }
  .npl-build-content { display: flex; flex-direction: column; gap: 14px; }
  .npl-skeleton {
    height: 13px; flex-shrink: 0;
    border: 1px solid var(--npl-border); border-radius: 5px; background: var(--npl-fill);
  }
  .npl-skeleton:nth-child(5n+1) { width: 33%; }
  .npl-skeleton:nth-child(5n+2) { width: 92%; }
  .npl-skeleton:nth-child(5n+3) { width: 67%; }
  .npl-skeleton:nth-child(5n+4) { width: 50%; }
  .npl-skeleton:nth-child(5n+5) { width: 75%; }
  .npl-stage[data-play="tl"] .npl-build-content {
    animation: npl-build-up 3s linear both;
  }
  @keyframes npl-build-up {
    from { transform: translateY(0); }
    to   { transform: translateY(-240px); }
  }
  .npl-code-badge {
    position: absolute; bottom: 20px; left: 14px;
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px;
    border: 1px solid var(--npl-border); border-radius: 50%;
  }
  .npl-nav-logo { width: 22px; height: auto; fill: var(--npl-accent); display: block; }

  /* BL — rain */
  .npl-rain { position: absolute; inset: 0; overflow: hidden; }
  .npl-rain-icon {
    position: absolute; top: 0;
    width: 30px; height: 30px;
    fill: currentColor; opacity: 0;
    will-change: transform, opacity;
    animation: npl-rain 2200ms cubic-bezier(0.4, 0, 0.6, 1) forwards;
  }
  @keyframes npl-rain {
    0%   { transform: translateY(-40px) scale(0.9); opacity: 0; }
    20%  { opacity: 0.85; }
    70%  { opacity: 0.85; }
    100% { transform: translateY(230px) scale(1); opacity: 0; }
  }

  /* TR — roadmap */
  #npl-rm-track {
    fill: none; stroke: var(--npl-border); stroke-width: 1.5;
    stroke-dasharray: 3 7; stroke-linecap: round;
  }
  #npl-rm-line {
    fill: none; stroke: var(--npl-accent); stroke-width: 2.2;
    stroke-linecap: round; stroke-linejoin: round;
  }
  #npl-rm-arrow {
    fill: var(--npl-accent); stroke: var(--npl-accent);
    stroke-width: 2; stroke-linejoin: round; opacity: 0;
  }
  .npl-stage .rm-node circle {
    fill: var(--npl-bg); stroke: var(--npl-accent); stroke-width: 1.8;
    transform-box: fill-box; transform-origin: center;
    transform: scale(0.3); opacity: 0;
    transition: transform 350ms cubic-bezier(0.65,0,0.35,1), opacity 250ms ease;
  }
  .npl-stage .rm-node .bar {
    fill: var(--npl-fill); stroke: var(--npl-border); stroke-width: 1;
    opacity: 0; transition: opacity 350ms ease 120ms;
  }
  .npl-stage .rm-node.on circle { transform: scale(1); opacity: 1; }
  .npl-stage .rm-node.on .bar  { opacity: 1; }
  .npl-stage .rm-node.end circle { display: none; }

  /* BR — checklist */
  .npl-checklist {
    position: absolute; left: 40px; right: 40px; top: 34px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .npl-item  { display: flex; align-items: center; gap: 12px; }
  .npl-cb {
    flex-shrink: 0; width: 20px; height: 20px;
    display: grid; place-items: center;
    border: 1.8px solid var(--npl-border); border-radius: 7px;
    transition: background 250ms ease, border-color 250ms ease;
  }
  .npl-cb svg {
    width: 13px; height: 13px; fill: none; stroke: var(--npl-on-accent);
    stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 18; stroke-dashoffset: 18;
    transition: stroke-dashoffset 300ms ease 100ms;
  }
  .npl-cl-line {
    height: 10px; border: 1px solid var(--npl-border);
    border-radius: 5px; background: var(--npl-fill);
    transition: background 300ms ease;
  }
  .npl-item:nth-child(1) .npl-cl-line { width: 62%; }
  .npl-item:nth-child(2) .npl-cl-line { width: 48%; }
  .npl-item:nth-child(3) .npl-cl-line { width: 72%; }
  .npl-item:nth-child(4) .npl-cl-line { width: 40%; }
  .npl-item.active .npl-cb { border-color: var(--npl-accent); animation: npl-pulse 900ms ease-in-out infinite; }
  .npl-item.done .npl-cb  { background: var(--npl-accent); border-color: var(--npl-accent); animation: none; }
  .npl-item.done .npl-cb svg { stroke-dashoffset: 0; }
  .npl-item.done .npl-cl-line { background: #B0B0A8; opacity: 0.5; }
  @keyframes npl-pulse { 50% { opacity: 0.45; } }
  .npl-progress {
    position: absolute; left: 40px; right: 40px; bottom: 26px;
    height: 5px; border: 1px solid var(--npl-border); border-radius: 5px;
    background: var(--npl-fill); overflow: hidden;
  }
  .npl-progress i {
    display: block; height: 100%; width: 0;
    background: var(--npl-accent); border-radius: 5px;
    transition: width 500ms cubic-bezier(0.65,0,0.35,1);
  }

  /* Status bar */
  .npl-status { margin: 0; font-size: 16px; line-height: 24px; text-align: center; }
  .npl-dots   { color: var(--npl-accent); }
  .npl-skill-label {
    display: block; font-size: 11px; font-weight: 600;
    color: var(--npl-accent); opacity: 0.65; margin-bottom: 2px; letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  @media (prefers-reduced-motion: reduce) {
    .npl-grid .npl-box, .npl-grid, .npl-panel, .npl-inner { transition: none; }
    .npl-stage[data-play="tl"] .npl-build-content { animation: none; }
    .npl-rain-icon { animation-duration: 1ms; opacity: 0.8; transform: translateY(110px); }
  }
`;

interface NaviPreloaderProps {
  skill?: string;
  /** Fixed status text. Omit to cycle the roadmap-generation messages
   *  ("Building your idea", "Mapping your roadmap", ...). Use this for generic
   *  loading states (auth check, hydration) where those would be misleading. */
  label?: string;
}

export function NaviPreloader({ skill, label }: NaviPreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef(label);
  labelRef.current = label;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stage    = root.querySelector<HTMLElement>('.npl-stage')!;
    const boxes    = [...root.querySelectorAll<HTMLElement>('.npl-grid .npl-box')];
    const msgEl    = root.querySelector<HTMLElement>('.npl-message')!;
    const dotsEl   = root.querySelector<HTMLElement>('.npl-dots')!;
    const rainEl   = root.querySelector<HTMLElement>('.npl-rain')!;
    const rmLine   = root.querySelector<SVGPathElement>('#npl-rm-line')!;
    const rmArrow  = root.querySelector<SVGPathElement>('#npl-rm-arrow')!;
    const rmNodesG = root.querySelector<SVGGElement>('#npl-rm-nodes')!;
    const clItems  = [...root.querySelectorAll<HTMLElement>('.npl-checklist .npl-item')];
    const progFill = root.querySelector<HTMLElement>('.npl-progress i')!;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ZOOM_MS = 900;

    // ── Rain ──────────────────────────────────────────────────────────────────
    const lanes = [8, 31, 54, 76];
    let queue: Icon[] = [];
    let rainTimer: ReturnType<typeof setInterval> | null = null;

    function shuffle<T>(arr: T[]): T[] {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function spawnWave() {
      if (reduced.matches) return;
      shuffle(lanes).forEach((lane, i) => {
        if (!queue.length) queue = shuffle([...ICONS]);
        const icon = queue.pop()!;
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('class', 'npl-rain-icon');
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', icon.d);
        svg.appendChild(p);
        svg.style.left = (lane + Math.random() * 6) + '%';
        svg.style.animationDelay = (i * 220 + Math.random() * 120) + 'ms';
        svg.addEventListener('animationend', () => svg.remove());
        rainEl.appendChild(svg);
      });
    }

    function stopRain() {
      if (rainTimer) clearInterval(rainTimer);
      rainTimer = null;
    }

    function startRain() {
      stopRain();
      rainEl.innerHTML = '';
      queue = shuffle([...ICONS]);
      const total = Math.ceil(ICONS.length / lanes.length);
      let n = 1;
      spawnWave();
      rainTimer = setInterval(() => {
        if (n < total) { spawnWave(); n++; } else stopRain();
      }, 1100);
    }

    // ── Roadmap ───────────────────────────────────────────────────────────────
    const rmLen = rmLine.getTotalLength();
    const rmNodes = [0, 0.36, 0.68, 1].map((f, i) => {
      const pt = rmLine.getPointAtLength(rmLen * f);
      const g  = document.createElementNS(NS, 'g');
      g.setAttribute('class', i === 3 ? 'rm-node end' : 'rm-node');
      const c  = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', String(pt.x));
      c.setAttribute('cy', String(pt.y));
      c.setAttribute('r', '6');
      g.appendChild(c);
      [[58, 0], [36, 1]].forEach(([w, row]) => {
        const r = document.createElementNS(NS, 'rect');
        const below = i === 0 || i === 3;
        const x = i === 0 ? pt.x - 6 : i === 3 ? pt.x + 6 - w : pt.x - 14 - w;
        const y = below ? pt.y + 13 + row * 9 : pt.y - 8 + row * 10;
        r.setAttribute('x', String(x));
        r.setAttribute('y', String(y));
        r.setAttribute('width', String(w));
        r.setAttribute('height', '5');
        r.setAttribute('rx', '2.5');
        r.setAttribute('class', 'bar');
        g.appendChild(r);
      });
      rmNodesG.appendChild(g);
      return { g, f };
    });

    let rmRaf = 0;
    function rmDraw(e: number) {
      rmLine.style.strokeDasharray = String(rmLen);
      rmLine.style.strokeDashoffset = String(rmLen - rmLen * e);
      const a = rmLine.getPointAtLength(Math.max(rmLen * e - 1, 0));
      const b = rmLine.getPointAtLength(Math.min(rmLen * e + 1, rmLen));
      const pt = rmLine.getPointAtLength(rmLen * e);
      rmArrow.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI})`);
      rmArrow.style.opacity = e > 0 ? '1' : '0';
      rmNodes.forEach(n => n.g.classList.toggle('on', e > 0 && e >= n.f - 0.001));
    }

    function rmStart() {
      cancelAnimationFrame(rmRaf);
      if (reduced.matches) { rmDraw(1); return; }
      rmDraw(0);
      const dur = 2800, t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / dur, 1);
        rmDraw(t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        if (t < 1) rmRaf = requestAnimationFrame(tick);
      };
      rmRaf = requestAnimationFrame(tick);
    }

    // ── Checklist ─────────────────────────────────────────────────────────────
    let timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.push(t);
    };

    function resetChecklist() {
      clItems.forEach(i => i.classList.remove('active', 'done'));
      progFill.style.width = '0';
    }

    function startChecklist() {
      resetChecklist();
      if (reduced.matches) {
        clItems.forEach(i => i.classList.add('done'));
        progFill.style.width = '100%';
        return;
      }
      clItems[0].classList.add('active');
      clItems.forEach((item, i) => later(() => {
        item.classList.remove('active');
        item.classList.add('done');
        progFill.style.width = ((i + 1) / clItems.length * 100) + '%';
        if (clItems[i + 1]) clItems[i + 1].classList.add('active');
      }, 600 + i * 700));
    }

    // ── Sequence ──────────────────────────────────────────────────────────────
    type Phase =
      | { kind: 'think';  sizes: number[]; duration: number; msg: string; q?: never }
      | { kind: 'regrid'; sizes: number[]; duration: number; msg: string; q?: never }
      | { kind: 'zoom';   sizes?: never;   duration: number; msg: string; q: string };

    const think = (sizes: number[]): Phase => ({ kind: 'think',  sizes, duration: 1100, msg: 'Thinking' });
    const sec   = (q: string, msg: string, dur: number): Phase[] => [
      { kind: 'regrid', sizes: [1,1,1,1], duration: 800, msg },
      { kind: 'zoom',   q, duration: dur, msg },
    ];

    const phases: Phase[] = [
      think([1,1,1,1]), think([2.4,1,1,1]), think([1,2.4,1,1]), think([1,2.4,2.4,1]),
      ...sec('tl', 'Building your idea',      ZOOM_MS + 3000),
      ...sec('bl', 'Gathering your sources',  ZOOM_MS + 5500),
      ...sec('tr', 'Mapping your roadmap',    ZOOM_MS + 3200),
      ...sec('br', 'Working out the details', ZOOM_MS + 3200),
    ];

    const starters: Record<string, () => void> = {
      tl: () => {},
      bl: startRain,
      tr: rmStart,
      br: startChecklist,
    };

    let step = 0;
    let dotCount = 1;
    let mainTimer: ReturnType<typeof setTimeout> | null = null;
    let dotTimer:  ReturnType<typeof setInterval> | null = null;

    function render() {
      const phase = phases[step];
      timers.forEach(clearTimeout);
      timers = [];

      const zoomed = phase.kind === 'zoom';
      stage.classList.toggle('is-zoom', zoomed);
      stage.dataset.zoom = zoomed ? phase.q : '';

      if (phase.sizes) {
        boxes.forEach((box, i) => { box.style.flexGrow = String(phase.sizes![i]); });
      }

      if (zoomed) {
        stage.dataset.play = '';
        stopRain();
        rainEl.innerHTML = '';
        cancelAnimationFrame(rmRaf);
        rmDraw(0);
        resetChecklist();
        later(() => {
          stage.dataset.show = phase.q;
          stage.dataset.play = phase.q;
          starters[phase.q]?.();
        }, ZOOM_MS);
      } else {
        stage.dataset.show = '';
        stopRain();
      }

      msgEl.textContent = labelRef.current ?? phase.msg;

      mainTimer = setTimeout(() => {
        step = (step + 1) % phases.length;
        render();
      }, phase.duration);
    }

    rmDraw(0);
    render();

    dotTimer = setInterval(() => {
      if (reduced.matches) return;
      dotCount = (dotCount % 3) + 1;
      dotsEl.textContent = '.'.repeat(dotCount);
    }, 400);

    return () => {
      if (mainTimer) clearTimeout(mainTimer);
      if (dotTimer)  clearInterval(dotTimer);
      stopRain();
      cancelAnimationFrame(rmRaf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={rootRef} className="npl-root">
      <style>{PRELOADER_CSS}</style>

      <main className="npl-preloader" aria-label="Generating roadmap" aria-busy="true">

        {/* ── 2×2 animated stage ─────────────────────────────────────── */}
        <div className="npl-stage" aria-hidden="true">

          {/* Background grid boxes */}
          <div className="npl-grid">
            <div className="npl-row">
              <div className="npl-box" />
              <div className="npl-box" />
            </div>
            <div className="npl-row">
              <div className="npl-box" />
              <div className="npl-box" />
            </div>
          </div>

          {/* TL — scrolling build list */}
          <div className="npl-box npl-panel tl">
            <div className="npl-inner">
              <div className="npl-build-window">
                <div className="npl-build-content">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="npl-skeleton" />
                  ))}
                </div>
              </div>
              <div className="npl-code-badge">
                <svg className="npl-nav-logo" viewBox="0 0 484 373" xmlns="http://www.w3.org/2000/svg" focusable="false">
                  <path
                    fillRule="evenodd"
                    d="M 481 94 L 406 1 L 339 96 L 342 110 L 355 113 L 388 80 L 398 148 L 398 191 L 390 237 L 377 267 L 357 291 L 326 309 L 306 311 L 284 299 L 255 263 L 176 113 L 135 53 L 98 26 L 77 24 L 59 30 L 25 65 L 11 99 L 2 144 L 4 252 L 27 335 L 52 363 L 78 370 L 100 369 L 150 350 L 203 309 L 241 347 L 284 368 L 331 371 L 378 356 L 418 323 L 443 271 L 446 202 L 437 80 L 463 112 L 479 111 Z M 96 116 L 102 116 L 105 118 L 115 132 L 127 158 L 129 165 L 132 170 L 136 182 L 139 187 L 141 194 L 154 222 L 154 224 L 167 251 L 177 268 L 177 270 L 174 274 L 157 290 L 138 301 L 123 305 L 108 305 L 94 301 L 89 296 L 84 286 L 80 271 L 79 261 L 78 260 L 77 245 L 76 244 L 76 232 L 75 231 L 75 182 L 76 181 L 76 170 L 77 169 L 78 155 L 79 154 L 79 150 L 83 134 L 89 122 Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* TR — roadmap SVG */}
          <div className="npl-box npl-panel tr">
            <div className="npl-inner">
              <svg
                id="npl-roadmap-svg"
                viewBox="0 0 320 214"
                preserveAspectRatio="xMidYMid meet"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
              >
                <path id="npl-rm-track" d="M34 180H100Q125 180 125 155V140Q125 115 150 115H180Q205 115 205 90V75Q205 50 230 50H286" />
                <path id="npl-rm-line"  d="M34 180H100Q125 180 125 155V140Q125 115 150 115H180Q205 115 205 90V75Q205 50 230 50H286" />
                <g id="npl-rm-nodes" />
                <path id="npl-rm-arrow" d="M-5 -6L8 0L-5 6Z" />
              </svg>
            </div>
          </div>

          {/* BL — logo rain */}
          <div className="npl-box npl-panel bl">
            <div className="npl-inner">
              <div className="npl-rain" />
            </div>
          </div>

          {/* BR — checklist */}
          <div className="npl-box npl-panel br">
            <div className="npl-inner">
              <div className="npl-checklist">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="npl-item">
                    <span className="npl-cb">
                      <svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" /></svg>
                    </span>
                    <span className="npl-cl-line" />
                  </div>
                ))}
              </div>
              <div className="npl-progress"><i /></div>
            </div>
          </div>

        </div>

        {/* ── Status text ─────────────────────────────────────────────── */}
        <p className="npl-status">
          {skill && <span className="npl-skill-label">{skill}</span>}
          <span className="npl-message">Thinking</span>
          <span className="npl-dots" aria-hidden="true">.</span>
        </p>

      </main>
    </div>
  );
}
