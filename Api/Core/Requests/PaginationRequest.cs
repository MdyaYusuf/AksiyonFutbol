namespace Api.Core.Requests;

public class PaginationRequest
{
  private const int MaxPageSize = 50;
  private int _pageSize = 10;
  private int _currentPage = 1;

  public int CurrentPage
  {
    get => _currentPage;
    set => _currentPage = value < 1 ? 1 : value;
  }

  public int PageSize
  {
    get => _pageSize;
    set
    {
      if (value < 1)
      {
        _pageSize = 1;
      }
      else if (value > MaxPageSize)
      {
        _pageSize = MaxPageSize;
      }
      else
      {
        _pageSize = value;
      }
    }
  }
}
