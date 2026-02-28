document.addEventListener('DOMContentLoaded', function() {
    var sidenav = document.querySelectorAll('.sidenav');
    
    var carousel = document.querySelectorAll('.carousel');
    var select = document.querySelectorAll("select");
    var collapsible = document.querySelectorAll(".collapsible");
    var optionsCarousel = {fullWidth: true, duration: 200, indicators: true};
    
    M.Carousel.init(carousel, optionsCarousel);
    let timer = setInterval(()=>{
      let instanceCarousel = M.Carousel.getInstance(carousel[0]);
      
      instanceCarousel.next();
    },3000)
    
    M.Sidenav.init(sidenav);
    
    
    
    M.FormSelect.init(select);
    M.Collapsible.init(collapsible);
    //abrir e fechar container pesquisar
    let btn_search = document.getElementById("btn-search");
    let container_search = document.getElementById("container-search");
    let container_close = document.getElementById("container-close");
    
    btn_search.addEventListener("click", ()=>{
      container_search.classList.remove("hide");
      
    })
    container_close.addEventListener("click", ()=>{
      container_search.classList.add("hide");
      container_close.classList.add("close-anim");
    })
  });
  
  
  
  
  /*
  formulario functions
  */
  //formatador de preço
  let inputPreco = document.getElementById("preco");

// Criamos o formatador uma única vez (fora da função) para ganhar performance
const formatadorReal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
});

inputPreco.oninput = function() {
    // 1. Pegamos apenas os dígitos (removemos R$, pontos e vírgulas)
    let valorLimpo = this.value.replace(/\D/g, "");

    // 2. Convertemos para número e dividimos por 100 para criar os centavos
    // Exemplo: se digitar "125", vira 1.25
    let valorDecimal = parseFloat(valorLimpo) / 100;

    // 3. Se o campo estiver vazio, limpamos o input
    if (isNaN(valorDecimal)) {
        this.value = "";
        return;
    }

    // 4. Chamamos a função para atualizar o campo com o valor formatado
    definePreco(valorDecimal);
};

function definePreco(valor) {
    // 5. O Intl.NumberFormat faz todo o trabalho de colocar R$, pontos e vírgulas
    inputPreco.value = formatadorReal.format(valor);
    // Digamos que o valor veio do seu input mascarado: "R$ 1.250,50"
let valorBruto = formatadorReal.format(valor);

// A mágica da limpeza para o MySQL:
document.getElementById("valorLimpo").value = valorBruto
    .replace("R$", "")      // Remove o cifrão
    .replace(/\./g, "")     // Remove o ponto de milhar (importante!)
    .replace(",", ".");     // Troca a vírgula decimal pelo ponto

// Agora sim você insere no banco:
// INSERT INTO produtos (preco) VALUES (paraOBanco); 
// O valor enviado será 1250.50

  
}

//preview das imagens
     window.lll = function(e) {
    
    if(!e.target.files) return;
    if(e.target.files.length > 4){
      M.toast({
  html: 'apenas 4 primeiras imagens serão enviadas!', 
  displayLength: 3000, 
  classes: 'rounded'
});

    }
    if(e.target.files){
    arquivos = Array.from(e.target.files).slice(0, 4);
    preview = document.getElementById("preview");
    preview.style.width = "250px";
    preview.style.display = "flex";
    preview.style.flexDirection = "row";
    preview.style.justifyContent = "space-between";
    
    arquivos.forEach((arquivo, index)=>{
      const objectURL = URL.createObjectURL(arquivo);
      const img = document.createElement("img");
      img.style.width = "50px";
      img.style.height = "50px";
      img.src = objectURL;
      preview.appendChild(img);
      
    console.log(objectURL)
    });
    
    }

  };

  